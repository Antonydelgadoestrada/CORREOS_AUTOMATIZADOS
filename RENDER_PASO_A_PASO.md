# 🎯 GUÍA VISUAL: Deploy Backend a Render

## 📍 ¿Dónde estamos?

```
✅ FRONTEND: En Vercel
⏳ BACKEND: Listo para Render
✅ BASE DE DATOS: En Supabase
```

---

## 🚀 PASO 1: Ir a Render

1. Abre [render.com](https://render.com) en navegador
2. Haz login con GitHub (si no tienes cuenta, crea una)

---

## 🚀 PASO 2: Crear Web Service

1. Haz click en **"New"** (botón arriba a la derecha)
2. Selecciona **"Web Service"**

---

## 🚀 PASO 3: Conectar Repositorio

1. Busca y selecciona: **`CORREOS_AUTOMATIZADOS`**
2. Rama: **`main`**
3. Click **"Connect"**

---

## 🚀 PASO 4: Configurar Servicio

Llena estos campos:

| Campo | Valor |
|-------|-------|
| **Name** | `correos-automatizados-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

---

## 🚀 PASO 5: Agregar Variables de Entorno

Click en **"Add Environment Variable"** y agrega CADA UNA:

### Variable 1:
- **Name**: `DB_HOST`
- **Value**: `tu_host_supabase` (ejemplo: `db.xxxxxx.supabase.co`)

### Variable 2:
- **Name**: `DB_USER`
- **Value**: `postgres`

### Variable 3:
- **Name**: `DB_PASSWORD`
- **Value**: `tu_password` (la contraseña de Supabase)

### Variable 4:
- **Name**: `DB_NAME`
- **Value**: `postgres`

### Variable 5:
- **Name**: `DB_PORT`
- **Value**: `5432`

### Variable 6:
- **Name**: `PORT`
- **Value**: `5000`

### Variable 7:
- **Name**: `FRONTEND_URL`
- **Value**: `https://correos-automatizados.vercel.app`

---

## 🚀 PASO 6: Deploy

1. Click **"Create Web Service"**
2. Espera 2-3 minutos mientras se deployment
3. Verás un log en vivo de todo lo que está pasando

---

## ✅ PASO 7: Obtener URL

Una vez que diga "✓ Your service is live" en verde:

1. Arriba en grande verás tu URL, como:
   ```
   https://correos-automatizados-api.onrender.com
   ```
   (La tuya será diferente)

2. **ANOTA ESTA URL**

3. Haz click en ella para probar:
   ```
   https://correos-automatizados-api.onrender.com/api/health
   ```
   Deberías ver:
   ```json
   {"mensaje":"Backend funcionando correctamente"}
   ```

---

## 🎯 PASO 8: Actualizar Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona proyecto `correos-automatizados`
3. Click **"Settings"** (arriba)
4. Busca **"Environment Variables"** en la izquierda
5. Click **"Add"** (o editar si existe)
6. Agrega:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://correos-automatizados-api.onrender.com` (tu URL de Render)
7. Click **"Save"**

---

## 🎯 PASO 9: Redeploy Frontend

1. Todavía en Vercel
2. Click en pestaña **"Deployments"**
3. Haz hover sobre el último deployment (el más reciente)
4. Click los **"..."** → **"Redeploy"**

Espera a que termine (1-2 minutos)

---

## ✅ VERIFICACIÓN FINAL

Abre tu app:
```
https://correos-automatizados.vercel.app
```

Prueba:
1. Envía un correo de prueba
2. Verifica que aparezca en "Historial"
3. Verifica que aparezca en "Calendario"
4. Verifica que puedas agregar opciones en "Opciones"

Si todo funciona → ¡LISTO! 🎉

---

## 🆘 Si algo no funciona

### ❌ "502 Bad Gateway" en Render
- Verifica variables de entorno en Render
- Revisa logs en Render Dashboard

### ❌ "Cannot reach API" en Vercel
- Verifica que REACT_APP_API_URL esté correcto en Vercel
- Haz Redeploy en Vercel

### ❌ "Cannot connect to database"
- Copia exactamente las credenciales de Supabase
- Sin espacios en blanco antes/después
- Verifica que tu IP está en whitelist de Supabase

---

## 📞 URLs que Necesitas

- **Mi API de Render**: https://correos-automatizados-api.onrender.com
- **Mi Frontend en Vercel**: https://correos-automatizados.vercel.app
- **Supabase**: https://supabase.com

---

**¡LISTO! Ya tienes todo deployado en la nube.** ☁️

**Última actualización**: 23 de Noviembre de 2025
