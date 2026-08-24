import pandas as pd
import numpy as np

RUTA_EXCEL = "app/data/INVENTARIO GENERAL TI - ACTUAL.xlsx"

def obtener_laptops():

    df = pd.read_excel(
        RUTA_EXCEL,
        sheet_name="LAPTOPS"
    )

    # Reemplazar NaN por None
    df = df.replace({np.nan: None})

    return df.to_dict(orient="records")