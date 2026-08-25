from fastapi import APIRouter, Query
import unicodedata

from app.services.excel_service import (
    obtener_hoja,
    obtener_kpis_principales,
    obtener_etag_actual,
)

router = APIRouter()

_PERFILES_CACHE = {
    "etag": None,
    "personas": {},
    "laptops": {},
    "celulares": {},
    "chips": {},
    "exchange": {},
    "modem": {},
}

# =========================
# DASHBOARD
# =========================

@router.get("/kpis")
def kpis():
    return obtener_kpis_principales()


# =========================
# CELULARES
# =========================

@router.get("/celulares")
def celulares():
    return obtener_hoja("CELULARES")


# =========================
# LAPTOPS
# =========================

@router.get("/laptops")
def laptops():
    return obtener_hoja("LAPTOPS")


# =========================
# REPORTADOS
# =========================

@router.get("/reportados")
def reportados():
    return obtener_hoja("EQUIPOS REPORTADOS")


# =========================
# CHIPS
# =========================

@router.get("/chips")
def chips():
    return obtener_hoja("ASIGNACIÓN CHIPS")


# =========================
# MODEM
# =========================

@router.get("/modem")
def modem():
    return obtener_hoja("MODEM")


# =========================
# MONITORES
# =========================

@router.get("/monitores")
def monitores():
    return obtener_hoja("MONITORES")


# =========================
# IMPRESORAS
# =========================

@router.get("/impresoras")
def impresoras():
    return obtener_hoja("IMPRESORAS")


# =========================
# EXCHANGE
# =========================

@router.get("/exchange")
def exchange():
    return obtener_hoja("EXCHANGE")


# =========================
# TRF
# =========================

@router.get("/trf")
def trf():
    return obtener_hoja("TRF")


# =========================
# DATACENTER SI
# =========================

@router.get("/datacenter-si")
def datacenter_si():
    return obtener_hoja("DATACENTER - SI")


# =========================
# DATACENTER PH
# =========================

@router.get("/datacenter-ph")
def datacenter_ph():
    return obtener_hoja("DATACENTER - PH")


# =========================
# DATA PERSONAL
# =========================

@router.get("/data-personal")
def data_personal():
    return obtener_hoja("DATA PERSONAL")


# =========================
# NORMALIZADOR
# =========================

def normalizar(texto):
    texto = str(texto)

    texto = unicodedata.normalize(
        "NFKD",
        texto
    )

    texto = "".join(
        c
        for c in texto
        if not unicodedata.combining(c)
    )

    return texto.upper().strip()

def _agrupar_por_usuario(registros, campo_usuario):
    indice = {}

    if isinstance(registros, dict):
        return indice

    for item in registros:
        usuario = normalizar(item.get(campo_usuario, ""))

        if not usuario:
            continue

        indice.setdefault(usuario, []).append(item)

    return indice

def _construir_cache_perfiles():
    global _PERFILES_CACHE

    etag_actual = obtener_etag_actual()

    # Si tenemos la misma versión del Excel,
    # reutilizamos los índices existentes.
    if (
        _PERFILES_CACHE["etag"] == etag_actual
        and _PERFILES_CACHE["personas"]
    ):
        return

    personas_data = obtener_hoja("DATA PERSONAL")
    laptops_data = obtener_hoja("LAPTOPS")
    celulares_data = obtener_hoja("CELULARES")
    chips_data = obtener_hoja("ASIGNACIÓN CHIPS")
    exchange_data = obtener_hoja("EXCHANGE")
    modem_data = obtener_hoja("MODEM")

    personas = {}

    if not isinstance(personas_data, dict):
        for persona in personas_data:
            usuario = normalizar(
                persona.get("USUARIO", "")
            )

            if usuario:
                personas[usuario] = persona

    _PERFILES_CACHE = {
        "etag": etag_actual,
        "personas": personas,

        "laptops": _agrupar_por_usuario(
            laptops_data,
            "USUARIO ASIGNADO",
        ),

        "celulares": _agrupar_por_usuario(
            celulares_data,
            "USUARIO",
        ),

        "chips": _agrupar_por_usuario(
            chips_data,
            "USUARIO",
        ),

        "exchange": _agrupar_por_usuario(
            exchange_data,
            "USUARIO",
        ),

        "modem": _agrupar_por_usuario(
            modem_data,
            "USUARIO",
        ),
    }

# =========================
# BUSCADOR GLOBAL
# =========================

@router.get("/busqueda-global")
def busqueda_global(
    q: str = Query(""),
    limite: int = Query(30, ge=1, le=100),
):

    if not q:
        return []

    hojas = {
        "Data Personal": "DATA PERSONAL",
        "Laptops": "LAPTOPS",
        "Celulares": "CELULARES",
        "Chips": "ASIGNACIÓN CHIPS",
        "Exchange": "EXCHANGE",
        "Monitores": "MONITORES",
        "Impresoras": "IMPRESORAS",
        "Modem": "MODEM"
    }

    resultados = []

    texto = normalizar(q)

    for modulo, hoja in hojas.items():

        registros = obtener_hoja(hoja)

        if isinstance(registros, dict):
            continue

        for fila in registros:

            encontrado = False

            for valor in fila.values():

                if texto in normalizar(valor):
                    encontrado = True
                    break

            if encontrado:
                resultados.append({
                    "modulo": modulo,
                    "datos": fila,
                })

                if len(resultados) >= limite:
                    return resultados

    return resultados


# =========================
# BUSQUEDA DE PERSONAS
# =========================

@router.get("/busqueda-personas")
def busqueda_personas(q: str = Query("")):

    if not q:
        return []

    _construir_cache_perfiles()

    texto = normalizar(q)

    resultados = []

    for usuario, persona in _PERFILES_CACHE["personas"].items():

        nombre = normalizar(
            persona.get("NOMBRES Y APELLIDOS", "")
        )

        if texto in usuario or texto in nombre:

            resultados.append({
                "usuario": persona.get("USUARIO"),
                "nombre": persona.get("NOMBRES Y APELLIDOS"),
                "cargo": persona.get("CARGO"),
                "area": persona.get("ÁREA"),
            })

        # No necesitamos devolver 500 coincidencias.
        if len(resultados) >= 20:
            break

    return resultados


# =========================
# PERFIL COMPLETO
# =========================

@router.get("/persona-completa/{usuario}")
def persona_completa(usuario: str):

    _construir_cache_perfiles()

    usuario_buscado = normalizar(usuario)

    persona = _PERFILES_CACHE["personas"].get(
        usuario_buscado
    )

    laptops = _PERFILES_CACHE["laptops"].get(
        usuario_buscado,
        []
    )

    celulares = _PERFILES_CACHE["celulares"].get(
        usuario_buscado,
        []
    )

    chips = _PERFILES_CACHE["chips"].get(
        usuario_buscado,
        []
    )

    exchange = _PERFILES_CACHE["exchange"].get(
        usuario_buscado,
        []
    )

    modem = _PERFILES_CACHE["modem"].get(
        usuario_buscado,
        []
    )

    return {
        "persona": persona,

        "total_laptops": len(laptops),
        "total_celulares": len(celulares),
        "total_chips": len(chips),
        "total_exchange": len(exchange),
        "total_modem": len(modem),

        "laptops": laptops,
        "celulares": celulares,
        "chips": chips,
        "exchange": exchange,
        "modem": modem,
    }
