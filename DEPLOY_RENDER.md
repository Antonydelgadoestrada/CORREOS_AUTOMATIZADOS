# 🚀 Deploy a Render - Backend

## Paso a Paso para Subir el Backend a Render

### 1. Preparar el Repositorio
El código ya está en GitHub. Asegúrate que todo esté committed y pusheado:

```bash
cd backend
git add .
git commit -m "Preparar para Render deployment"
git push origin main
```

### 2. Ir a Render

1. Ve a [render.com](https://render.com)
2. Haz login o crea una cuenta
3. Click en "New" → "Web Service"

### 3. Conectar Repositorio

1. Selecciona tu repositorio de GitHub: `CORREOS_AUTOMATIZADOS`
2. Selecciona rama: `main`
3. Click "Connect"

### 4. Configurar el Servicio

**Nombre**: `correos-automatizados-api`

**Entorno**: `Node`

**Build Command** (importante - desde la raíz del backend):
```
npm install
```

**Start Command** (importante):
```
npm start
```

**Plan**: Free (o el que prefieras)

### 5. Variables de Entorno

Agregar en "Environment Variables":

```
DB_HOST = tu_supabase_host.supabase.co
DB_USER = postgres
DB_PASSWORD = tu_password_supabase
DB_NAME = postgres
DB_PORT = 5432
PORT = 5000
FRONTEND_URL = https://correos-automatizados.vercel.app
SENDGRID_API_KEY = (opcional)
```

**IMPORTANTE**: Todos los valores deben ser EXACTOS. Copia de Supabase sin espacios.

### 6. Deploy

Click en "Create Web Service"

El deployment tardará 2-3 minutos. Verás un log en vivo.

### 7. Obtener URL del Backend

Una vez deployado, verás una URL como:
```
https://correos-automatizados-api.onrender.com
```

Anota esta URL, la necesitarás después.

---

## ✅ Verificar que Funciona

```bash
# Probar endpoint health
curl https://correos-automatizados-api.onrender.com/api/health

# Respuesta esperada:
# {"mensaje":"Backend funcionando correctamente"}
```

---

## 🔗 Conectar Frontend con Backend

En `frontend/src/components/EmailForm.js`, actualiza las URLs:

Cambiar:
```javascript
fetch('http://localhost:5000/api/enviar-correo'
```

Por:
```javascript
fetch('https://correos-automatizados-api.onrender.com/api/enviar-correo'
```

Hacer lo mismo en todos los componentes que hagan fetch al backend:
- `EmailForm.js`
- `HistorialCorreos.js`
- `Calendar.js`
- `AdminOpciones.js`

O mejor aún, crear variable de entorno en `.env`:
```
REACT_APP_API_URL=https://correos-automatizados-api.onrender.com
```

Y usar:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/enviar-correo`
```

---

## 🆘 Problemas Comunes

### "Error: connect ECONNREFUSED"
- Verificar que las variables de BD están correctas
- Verificar que IP de Render está en whitelist de Supabase

### "Build failed"
- Revisar logs en Render
- Verificar que `npm install` funciona localmente

### "Cannot GET /api/health"
- El servicio está deployado pero las rutas no funcionan
- Revisar que el start command sea `npm start`

---

## 📝 Últimas Actualizaciones

- ✅ CORS configurado para Vercel
- ✅ Backend escuchando en 0.0.0.0 (compatible con Render)
- ✅ Variables de entorno listos
- ✅ Health check endpoint disponible

---

## 🔄 Actualizar Backend en Render

Cualquier cambio que hagas en GitHub se deployará automáticamente.

Si desactivas auto-deploy:
1. Ir a Dashboard de Render
2. Click en tu servicio
3. Click "Deploy latest commit"

---

**Última actualización**: 23 de Noviembre de 2025
