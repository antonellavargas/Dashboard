# Migración Inventario TI: OneDrive/SharePoint + FastAPI + GitHub Pages

## Arquitectura objetivo

Excel privado en Microsoft 365 → Microsoft Graph → FastAPI publicado → React/Vite en GitHub Pages.

El frontend nunca recibe credenciales de Microsoft. Solo consulta la API FastAPI por HTTPS.

## 1. Probar la versión actual en modo local

Backend:

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

En `backend/.env` dejar inicialmente:

```env
DATA_SOURCE=local
CORS_ORIGINS=http://localhost:5173
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

En `frontend/.env`:

```env
VITE_API_URL=/api
```

## 2. Configurar Microsoft 365

Se necesita una aplicación de Microsoft Entra ID autorizada para leer el archivo de SharePoint/OneDrive empresarial.

Variables necesarias en el backend:

```env
DATA_SOURCE=onedrive
MS_TENANT_ID=...
MS_CLIENT_ID=...
MS_CLIENT_SECRET=...
MS_DRIVE_ID=...
MS_EXCEL_ITEM_ID=...
```

También se puede usar la ruta del archivo en lugar del Item ID:

```env
MS_EXCEL_PATH=Inventario/INVENTARIO GENERAL TI - ACTUAL.xlsx
```

No configurar `MS_EXCEL_ITEM_ID` y `MS_EXCEL_PATH` a la vez; se recomienda Item ID porque no cambia si se renombra el archivo.

### Seguridad recomendada

Para información interna, mantener el Excel privado. Solicitar a TI una App Registration con permisos de Microsoft Graph limitados al sitio/archivo correspondiente cuando la política del tenant lo permita (por ejemplo, permisos Selected). Evitar permisos amplios a todo SharePoint si no son necesarios.

## 3. Comprobar la conexión

Con `DATA_SOURCE=onedrive`, iniciar FastAPI y revisar:

- `/health`
- `/fuente-datos`
- `/kpis`
- `/laptops`

`/fuente-datos` muestra metadatos del archivo, pero nunca secretos.

El backend compara el eTag del archivo. Si el Excel no cambió, reutiliza la copia en memoria; si cambió, vuelve a descargarlo.

## 4. Publicar el backend

El backend necesita un hosting que ejecute Python permanentemente (por ejemplo, Azure App Service, Azure Container Apps u otro servicio compatible con FastAPI).

Configurar allí las variables de entorno del archivo `backend/.env.example`.

En producción, `CORS_ORIGINS` debe contener el origen exacto de GitHub Pages, por ejemplo:

```env
CORS_ORIGINS=https://TU-USUARIO.github.io
```

## 5. Conectar el frontend al backend publicado

En el entorno de build del frontend:

```env
VITE_API_URL=https://URL-DE-TU-BACKEND
```

La aplicación usa un cliente Axios centralizado en `src/services/api.js`.

## 6. Publicar en GitHub Pages

El proyecto usa rutas relativas de Vite y `HashRouter` para evitar errores 404 al navegar en GitHub Pages.

Antes de publicar:

```bash
cd frontend
npm run build
```

El contenido de `frontend/dist` es el sitio estático que se publica en GitHub Pages.

## Archivos principales modificados

- `backend/app/services/onedrive_service.py`
- `backend/app/services/excel_service.py`
- `backend/app/main.py`
- `backend/.env.example`
- `backend/requirements.txt`
- `frontend/src/services/api.js`
- `frontend/src/components/BuscadorGlobal.jsx`
- `frontend/src/pages/DashboardGeneral.jsx`
- `frontend/src/App.jsx`
- `frontend/vite.config.js`
- `frontend/.env.example`

## Flujo de actualización

1. Un usuario modifica el Excel en Microsoft 365.
2. El archivo recibe un nuevo eTag.
3. La siguiente petición al dashboard consulta el metadato.
4. Si el eTag cambió, FastAPI descarga la nueva versión.
5. Los endpoints vuelven a procesar las hojas con pandas.
6. React recibe los datos actualizados.
