# 🚀 Inicio Rápido

## Pasos para ejecutar el proyecto localmente

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/CORREOS_AUTOMATIZADOS.git
cd CORREOS_AUTOMATIZADOS
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env con tus credenciales
# (Ver README.md para más detalles)

# Iniciar servidor
npm start
# El servidor estará en http://localhost:5000
```

### 3. Configurar Frontend (en otra terminal)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm start
# La app estará en http://localhost:3000
```

---

## ✅ Checklist antes de usar

- [ ] Cuenta en Supabase creada
- [ ] Base de datos configurada (ejecutar `plantillas_schema.sql`)
- [ ] Variables de entorno en `backend/.env`
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Outlook instalado en el sistema

---

## 📱 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Supabase**: https://supabase.com

---

## 🆘 Problemas Comunes

**Q: "Error: connect ECONNREFUSED"**  
A: Asegúrate que el backend está corriendo en puerto 5000

**Q: "No se conecta a Supabase"**  
A: Verifica credenciales en `.env` y whitelist de IP

**Q: "Outlook no abre"**  
A: Verifica que Outlook esté instalado localmente

---

## 📞 Soporte

Revisa el README.md para documentación completa.
