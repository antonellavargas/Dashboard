import os
from pathlib import Path

import pandas as pd

from app.services.onedrive_service import obtener_excel_onedrive, estado_fuente_onedrive

BASE_DIR = Path(__file__).resolve().parent.parent
RUTA_EXCEL_LOCAL = BASE_DIR / "data" / "INVENTARIO GENERAL TI - ACTUAL.xlsx"


def _data_source() -> str:
    return os.getenv("DATA_SOURCE", "local").strip().lower()


def obtener_fuente_excel():
    """Retorna una fuente compatible con pandas.read_excel.

    DATA_SOURCE=local     -> usa el Excel incluido en backend/app/data
    DATA_SOURCE=onedrive  -> descarga/usa caché del Excel privado en Microsoft 365
    """
    source = _data_source()

    if source == "onedrive":
        return obtener_excel_onedrive()

    if source == "local":
        if not RUTA_EXCEL_LOCAL.exists():
            raise FileNotFoundError(
                f"No se encontró el archivo Excel local en: {RUTA_EXCEL_LOCAL}"
            )
        return RUTA_EXCEL_LOCAL

    raise RuntimeError(
        f"DATA_SOURCE='{source}' no es válido. Usa 'local' u 'onedrive'."
    )


def obtener_hoja(nombre_hoja):
    try:
        df = pd.read_excel(
            obtener_fuente_excel(),
            sheet_name=nombre_hoja,
        )
        df = df.fillna("")
        return df.to_dict(orient="records")

    except ValueError as e:
        return {"error": f"No se encontró la hoja '{nombre_hoja}': {str(e)}"}

    except Exception as e:
        return {"error": str(e)}


def obtener_kpis_principales():
    hojas = {
        "laptops": "LAPTOPS",
        "celulares": "CELULARES",
        "monitores": "MONITORES",
        "impresoras": "IMPRESORAS",
        "chips": "ASIGNACIÓN CHIPS",
        "modem": "MODEM",
        "exchange": "EXCHANGE",
        "reportados": "EQUIPOS REPORTADOS",
    }

    resultado = {}
    total = 0

    try:
        fuente = obtener_fuente_excel()
        libro = pd.ExcelFile(fuente)

        for clave, hoja in hojas.items():
            try:
                df = pd.read_excel(libro, sheet_name=hoja)
                cantidad = len(df)
                resultado[clave] = cantidad
                total += cantidad
            except Exception as e:
                resultado[clave] = 0
                resultado[f"{clave}_error"] = str(e)

    except Exception as e:
        resultado["error_fuente"] = str(e)
        for clave in hojas:
            resultado[clave] = 0

    resultado["total"] = total
    return resultado


def obtener_estado_fuente():
    source = _data_source()

    if source == "onedrive":
        try:
            return estado_fuente_onedrive()
        except Exception as e:
            return {"fuente": "onedrive", "estado": "error", "error": str(e)}

    return {
        "fuente": "local",
        "archivo": RUTA_EXCEL_LOCAL.name,
        "existe": RUTA_EXCEL_LOCAL.exists(),
    }
