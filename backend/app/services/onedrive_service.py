import io
import os
import threading
from dataclasses import dataclass
from typing import Optional
from urllib.parse import quote


GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0"


@dataclass
class ExcelCache:
    content: Optional[bytes] = None
    etag: Optional[str] = None


_cache = ExcelCache()
_cache_lock = threading.Lock()


def _required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Falta configurar la variable de entorno {name}")
    return value


def _get_access_token() -> str:
    import msal
    tenant_id = _required_env("MS_TENANT_ID")
    client_id = _required_env("MS_CLIENT_ID")
    client_secret = _required_env("MS_CLIENT_SECRET")

    app = msal.ConfidentialClientApplication(
        client_id=client_id,
        authority=f"https://login.microsoftonline.com/{tenant_id}",
        client_credential=client_secret,
    )

    result = app.acquire_token_silent(
        scopes=["https://graph.microsoft.com/.default"],
        account=None,
    )

    if not result:
        result = app.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"]
        )

    token = result.get("access_token")
    if not token:
        detail = result.get("error_description") or result.get("error") or "Error desconocido"
        raise RuntimeError(f"No se pudo obtener token de Microsoft Graph: {detail}")

    return token


def _item_url() -> str:
    drive_id = _required_env("MS_DRIVE_ID")
    item_id = os.getenv("MS_EXCEL_ITEM_ID", "").strip()
    item_path = os.getenv("MS_EXCEL_PATH", "").strip().strip("/")

    if item_id:
        return f"{GRAPH_BASE_URL}/drives/{drive_id}/items/{item_id}"

    if item_path:
        encoded_path = quote(item_path, safe="/")
        return f"{GRAPH_BASE_URL}/drives/{drive_id}/root:/{encoded_path}"

    raise RuntimeError("Configura MS_EXCEL_ITEM_ID o MS_EXCEL_PATH")


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def obtener_excel_onedrive(force_refresh: bool = False) -> io.BytesIO:
    import requests
    """Obtiene el Excel privado desde OneDrive/SharePoint mediante Microsoft Graph.

    Usa el eTag del archivo para evitar descargarlo nuevamente si no cambió.
    Devuelve BytesIO para que pandas pueda leerlo como si fuera un archivo local.
    """
    token = _get_access_token()
    item_url = _item_url()

    with _cache_lock:
        metadata_response = requests.get(
            f"{item_url}?$select=id,name,eTag,lastModifiedDateTime,size",
            headers=_headers(token),
            timeout=30,
        )
        metadata_response.raise_for_status()
        metadata = metadata_response.json()

        current_etag = metadata.get("eTag")

        if (
            not force_refresh
            and _cache.content is not None
            and current_etag
            and current_etag == _cache.etag
        ):
            return io.BytesIO(_cache.content)

        download_response = requests.get(
            f"{item_url}/content",
            headers=_headers(token),
            timeout=60,
            allow_redirects=True,
        )
        download_response.raise_for_status()

        _cache.content = download_response.content
        _cache.etag = current_etag

        return io.BytesIO(_cache.content)


def estado_fuente_onedrive() -> dict:
    import requests
    """Devuelve metadatos mínimos para diagnóstico, sin exponer secretos."""
    token = _get_access_token()
    item_url = _item_url()

    response = requests.get(
        f"{item_url}?$select=id,name,eTag,lastModifiedDateTime,size",
        headers=_headers(token),
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    return {
        "fuente": "onedrive",
        "archivo": data.get("name"),
        "ultima_modificacion": data.get("lastModifiedDateTime"),
        "tamano_bytes": data.get("size"),
        "etag": data.get("eTag"),
    }
