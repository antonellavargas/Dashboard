import pandas as pd

RUTA_EXCEL = "app/data/INVENTARIO GENERAL TI - ACTUAL.xlsx"

def obtener_kpis():

    laptops = pd.read_excel(
        RUTA_EXCEL,
        sheet_name="LAPTOPS"
    )

    celulares = pd.read_excel(
        RUTA_EXCEL,
        sheet_name="CELULARES"
    )

    monitores = pd.read_excel(
        RUTA_EXCEL,
        sheet_name="MONITORES"
    )

    impresoras = pd.read_excel(
        RUTA_EXCEL,
        sheet_name="IMPRESORAS"
    )

    return {
        "laptops": len(laptops),
        "celulares": len(celulares),
        "monitores": len(monitores),
        "impresoras": len(impresoras),
        "total": (
            len(laptops)
            + len(celulares)
            + len(monitores)
            + len(impresoras)
        )
    }