from fastapi import APIRouter, Query
import unicodedata

from app.services.excel_service import (
    obtener_hoja,
    obtener_kpis_principales
)

router = APIRouter()


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


# =========================
# BUSCADOR GLOBAL
# =========================

@router.get("/busqueda-global")
def busqueda_global(q: str = Query("")):

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
                    "datos": fila
                })

    return resultados


# =========================
# BUSQUEDA DE PERSONAS
# =========================

@router.get("/busqueda-personas")
def busqueda_personas(q: str = Query("")):

    if not q:
        return []

    personas = obtener_hoja("DATA PERSONAL")

    if isinstance(personas, dict):
        return []

    texto = normalizar(q)

    resultados = []

    for persona in personas:

        usuario = normalizar(
            persona.get("USUARIO", "")
        )

        nombre = normalizar(
            persona.get(
                "NOMBRES Y APELLIDOS",
                ""
            )
        )

        if texto in usuario or texto in nombre:

            resultados.append({
                "usuario": persona.get("USUARIO"),
                "nombre": persona.get("NOMBRES Y APELLIDOS"),
                "cargo": persona.get("CARGO"),
                "area": persona.get("ÁREA")
            })

    return resultados


# =========================
# PERFIL COMPLETO
# =========================

@router.get("/persona-completa/{usuario}")
def persona_completa(usuario: str):

    usuario_buscado = normalizar(usuario)

    # DATA PERSONAL
    personas = obtener_hoja("DATA PERSONAL")

    if isinstance(personas, dict):
        personas = []

    persona = next(
        (
            p for p in personas
            if normalizar(
                p.get("USUARIO", "")
            ) == usuario_buscado
        ),
        None
    )

    # LAPTOPS
    laptops_data = obtener_hoja("LAPTOPS")
    if isinstance(laptops_data, dict):
        laptops_data = []

    laptops = [
        item
        for item in laptops_data
        if normalizar(
            item.get("USUARIO ASIGNADO", "")
        ) == usuario_buscado
    ]

    # CELULARES
    celulares_data = obtener_hoja("CELULARES")
    if isinstance(celulares_data, dict):
        celulares_data = []

    celulares = [
        item
        for item in celulares_data
        if normalizar(
            item.get("USUARIO", "")
        ) == usuario_buscado
    ]

    # CHIPS
    chips_data = obtener_hoja("ASIGNACIÓN CHIPS")
    if isinstance(chips_data, dict):
        chips_data = []

    chips = [
        item
        for item in chips_data
        if normalizar(
            item.get("USUARIO", "")
        ) == usuario_buscado
    ]

    # EXCHANGE
    exchange_data = obtener_hoja("EXCHANGE")
    if isinstance(exchange_data, dict):
        exchange_data = []

    exchange = [
        item
        for item in exchange_data
        if normalizar(
            item.get("USUARIO", "")
        ) == usuario_buscado
    ]

    # MODEM
    modem_data = obtener_hoja("MODEM")
    if isinstance(modem_data, dict):
        modem_data = []

    modem = [
        item
        for item in modem_data
        if normalizar(
            item.get("USUARIO", "")
        ) == usuario_buscado
    ]

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
        "modem": modem
    }