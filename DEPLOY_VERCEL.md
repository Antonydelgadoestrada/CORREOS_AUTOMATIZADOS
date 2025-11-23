# 🚀 Deploy a Vercel - Frontend

## Guía Rápida para Actualizar Frontend en Vercel

Ya subiste a Vercel. Ahora necesitas actualizar la URL del backend.

### Paso 1: Obtener URL de Render

Una vez deployado el backend en Render, tendrás una URL como:
```
https://correos-automatizados-api.onrender.com
```

### Paso 2: Configurar Variable de Entorno en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto `correos-automatizados`
3. Click en "Settings" → "Environment Variables"
4. Agregar variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://correos-automatizados-api.onrender.com`
5. Click "Save"

### Paso 3: Redeploy

1. Ve a "Deployments"
2. Haz hover sobre el último deployment
3. Click los "..." → "Redeploy"

O simplemente haz un push a GitHub:
```bash
git add .
git commit -m "Actualizar URL del backend a Render"
git push origin main
```

El deployment se hará automáticamente.

---

## ✅ Verificar que Funciona

Una vez deployado en Vercel:

1. Ve a https://correos-automatizados.vercel.app (tu URL real)
2. Intenta enviar un correo de prueba
3. Revisa que aparezca en Historial
4. Verifica que el calendario muestre el evento

---

## 🔗 URLs Finales

- **Frontend**: https://correos-automatizados.vercel.app
- **Backend**: https://correos-automatizados-api.onrender.com
- **Base de Datos**: Supabase (en la nube)

---

## 📱 Flujo Completo Deployado

```
Usuario abre: https://correos-automatizados.vercel.app
       ↓
Frontend (Vercel) llama a:
       ↓
Backend API (Render): https://correos-automatizados-api.onrender.com
       ↓
Base de Datos (Supabase)
```

---

**Última actualización**: 23 de Noviembre de 2025
