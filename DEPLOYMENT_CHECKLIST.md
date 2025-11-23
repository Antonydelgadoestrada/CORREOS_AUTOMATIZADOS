# 📋 Resumen de Deploy Completo

## Estado Actual (23 de Noviembre de 2025)

✅ **Frontend** - SUBIDO A VERCEL
- URL: https://correos-automatizados.vercel.app
- Estado: Funcionando localmente, necesita URL del backend

⏳ **Backend** - PENDIENTE SUBIR A RENDER
- Estado: Listo para deployment

✅ **Base de Datos** - EN SUPABASE
- Estado: Completamente configurada y funcionando

---

## Paso a Paso INMEDIATO

### 1️⃣ Subir Backend a Render (5 minutos)

```bash
# 1. Ir a https://render.com
# 2. Click "New" → "Web Service"
# 3. Conectar repositorio GitHub
# 4. Llenar configuración:

Build Command: npm install
Start Command: npm start

# 5. Agregar Variables de Entorno:
DB_HOST=tu_host_supabase
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=postgres
DB_PORT=5432
PORT=5000
FRONTEND_URL=https://correos-automatizados.vercel.app

# 6. Click "Create Web Service"
# 7. Esperar 2-3 minutos a que se deploy
# 8. Copiar URL: https://correos-automatizados-api.onrender.com (SERÁ DIFERENTE)
```

### 2️⃣ Actualizar Frontend (5 minutos)

```bash
# En Vercel Dashboard:
# 1. Selecciona proyecto correos-automatizados
# 2. Settings → Environment Variables
# 3. Agregar:
#    REACT_APP_API_URL = (tu URL de Render)
# 4. Redeploy
```

### 3️⃣ Verificar (1 minuto)

```bash
# Abrir: https://correos-automatizados.vercel.app
# Probar: Enviar correo de prueba
# Verificar: Aparece en Historial
```

---

## 🔑 Variables de Entorno Necesarias

### Render (Backend)
```
DB_HOST=db.xxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=postgres
DB_PORT=5432
PORT=5000
FRONTEND_URL=https://correos-automatizados.vercel.app
```

### Vercel (Frontend)
```
REACT_APP_API_URL=https://correos-automatizados-api.onrender.com
```

---

## 📍 URLs Finales

| Componente | URL |
|-----------|-----|
| Frontend | https://correos-automatizados.vercel.app |
| Backend API | https://correos-automatizados-api.onrender.com |
| Base de Datos | Supabase (privada) |

---

## ✅ Checklist Final

- [ ] Backend deployado en Render
- [ ] URL de Render copiada
- [ ] Variables de entorno en Vercel actualizadas
- [ ] Frontend redeployado
- [ ] Prueba: Enviar correo desde la web
- [ ] Prueba: Verificar en historial
- [ ] Prueba: Ver evento en calendario

---

## 🆘 Si algo falla

### "Error de conexión a BD"
- Copiar credenciales exactamente desde Supabase
- Sin espacios en blanco
- Verificar puerto 5432

### "CORS error"
- El backend está deployado pero frontend no puede conectar
- Verificar REACT_APP_API_URL está correcto
- Rehacer Redeploy en Vercel

### "404 - API no responde"
- El backend está en Render pero no responde
- Ir a Render Dashboard → Logs
- Revisar por errores

---

## 📞 Soporte Rápido

Si necesitas ayuda después de deployment:
1. Verifica todas las variables de entorno
2. Revisa logs en Render (Dashboard → Logs)
3. Revisa logs en Vercel (Deployments → View Logs)
4. Confirma que Supabase está accesible

---

**Este es tu comando para empezar ahora:**

```bash
# Solo hace falta ir a:
# 1. render.com
# 2. Nueva Web Service
# 3. Conectar GitHub
# 4. Llenar config arriba
# 5. Deploy
```

¡Listo para comenzar el deployment! 🚀

**Última actualización**: 23 de Noviembre de 2025
