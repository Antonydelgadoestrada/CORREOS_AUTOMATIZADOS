# 📧 Correos Automatizados - Gestión de Inspecciones

**Aplicación portable de gestión de correos y calendario para inspecciones en empresas de exportación agrícola. 100% offline, funciona desde USB sin dependencias externas.**

---

## 🚀 Características

✅ **Envío de Correos**
- 3 plantillas predefinidas (Planificación Interna, Externa, Orden de Trabajo)
- Generación de tablas HTML para Outlook
- Almacenamiento en base de datos local

✅ **Calendario de Inspecciones**
- Visualización interactiva de eventos
- Estados dinámicos (Programada, En Proceso, Finalizada, Reprogramada)
- Colores según estado del evento
- Reprogramación de inspecciones

✅ **Reportes Mensuales**
- Filtrado por mes y año
- Resumen por estado
- Exportación CSV/PDF

✅ **Historial de Correos**
- Búsqueda avanzada por productor, destinatario, fecha
- Vista detallada con tablas renderizadas

✅ **Administración de Opciones**
- Gestión de valores para dropdowns
- Categorías: Auditor, Norma, Alcance, Modalidad
- Agregar/eliminar opciones dinámicamente

---

## 📦 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + Material-UI + FullCalendar |
| **Backend** | Node.js + Express.js |
| **Base de Datos** | SQLite 3 (archivo portátil .db) |
| **Build/Deploy** | npm + Static files |

---

## 🛠️ Requisitos

- **Node.js 16+** ([Descargar](https://nodejs.org))
- **Windows 10/11** (o cualquier OS con Node.js)

---

## 🚀 Instalación Rápida

### Opción 1: Script Automático (Recomendado)

```bash
# 1. Hacer doble-clic en:
iniciar.bat

# Automáticamente:
# - Instala dependencias
# - Inicia servidor en puerto 5000
# - Abre http://localhost:5000
```

### Opción 2: Línea de Comando

```bash
# Ir a la carpeta del proyecto
cd CORREOS_AUTOMATIZADOS

# Instalar dependencias (solo primera vez)
cd backend && npm install

# Compilar frontend (solo primera vez)
cd ../frontend && npm run build

# Iniciar servidor
cd ../backend && npm start

# Abrir navegador: http://localhost:5000
```

---

## 🛑 Detener

```bash
# Doble-clic en:
detener.bat

# O en terminal: Ctrl + C
```

---

## 📂 Estructura del Proyecto

```
CORREOS_AUTOMATIZADOS/
├── iniciar.bat                 # Script para iniciar
├── detener.bat                 # Script para detener
├── .env                        # Configuración
├── README.md                   # Este archivo
│
├── backend/
│   ├── src/
│   │   ├── index.js           # Servidor principal
│   │   ├── config/
│   │   │   └── database.js    # Conexión SQLite
│   │   ├── controllers/
│   │   │   └── emailController.js
│   │   ├── routes/
│   │   │   └── emailRoutes.js
│   │   ├── services/
│   │   │   └── emailService.js
│   │   └── utils/
│   ├── scripts/
│   │   └── migrarDatos.js     # Script de migración
│   ├── data/
│   │   └── correos.db         # Base de datos
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── EmailForm.js
│   │   │   ├── Calendar.js
│   │   │   ├── HistorialCorreos.js
│   │   │   ├── ReporteInspecciones.js
│   │   │   └── AdminOpciones.js
│   │   ├── utils/
│   │   │   └── apiService.js
│   │   └── ...
│   ├── build/                 # Compilado
│   └── package.json
│
└── .git/                       # Control de versión
```

---

## ⚙️ Configuración

### .env

```env
# Puerto
PORT=5000

# Base de datos
DB_PATH=./data/correos.db

# Ambiente
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://localhost:5000
```

---

## 🗄️ Base de Datos

### Tablas

**plantillas** (3 email templates)
```
id, nombre, asunto, contenido_html, creado_en
```

**opciones** (60+ valores)
```
id, categoria (Auditor/Norma/Alcance/Modalidad), valor, creado_en
```

**correos_enviados** (email history)
```
id, destinatario, asunto, contenido, contenido_html, productor, fecha_envio
```

**eventos_inspecciones** (calendar events)
```
id, titulo, fecha_inicio, fecha_fin, estado, descripcion, creado_en
```

### Respaldar Datos

```bash
# Copiar archivo
copy backend/data/correos.db backup_correos.db

# Restaurar
copy backup_correos.db backend/data/correos.db
```

---

## 🌐 API Endpoints

### Correos
```
POST   /api/enviar-correo
GET    /api/correos-enviados
```

### Inspecciones
```
GET    /api/eventos
GET    /api/eventos/mes/:anio/:mes
PUT    /api/eventos/reprogramar
```

### Opciones
```
GET    /api/opciones
POST   /api/opciones
DELETE /api/opciones/:id
```

---

## 📖 Uso

### 1. Enviar Correo

1. Ir a tab **"Enviar Correo"**
2. Seleccionar plantilla
3. Llenar campos
4. Click **"Guardar y Enviar"**
5. Se abre en Outlook automáticamente
6. Evento se crea en calendario

### 2. Ver Calendario

1. Ir a tab **"Calendario"**
2. Eventos mostrados con colores
3. Click en evento para detalles
4. Reprogramar si es necesario

### 3. Consultar Historial

1. Ir a tab **"Historial"**
2. Usar filtros (productor, fecha, etc.)
3. Click **"Ver"** para detalles completos

### 4. Generar Reportes

1. Ir a tab **"Reporte"**
2. Seleccionar mes/año
3. Resumen por estado aparece
4. Exportar CSV o PDF

### 5. Administrar Opciones

1. Ir a tab **"Opciones"**
2. Seleccionar categoría
3. Agregar/eliminar valores

---

## 🔧 Desarrollo

### Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Desarrollo local

```bash
# Terminal 1: Backend (con hot-reload)
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### Compilar producción

```bash
# Frontend
cd frontend
npm run build
```

El backend sirve automáticamente los archivos compilados.

---

## 📦 Distribución en USB

1. Copiar carpeta `CORREOS_AUTOMATIZADOS/` a USB
2. Distribuir USB a usuarios
3. Cada usuario hace: doble-clic en `iniciar.bat`
4. ¡Listo! Cada uno tiene su BD independiente

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `node no reconocido` | Instala Node.js desde nodejs.org |
| Puerto 5000 ocupado | Cambia `PORT=5000` a `PORT=5001` en `.env` |
| App no carga datos | Espera 5-10 segundos, recarga con F5 |
| `correos.db` no existe | Ejecuta `npm start` una vez |

---

## 🔐 Notas de Seguridad

⚠️ **IMPORTANTE:**
- Datos almacenados localmente en `backend/data/correos.db`
- Sin autenticación (aplicación local)
- Respalda frecuentemente
- Si pierdes USB, pierdes datos

---

## 📝 Migración de Datos

Para importar datos de una versión anterior:

```bash
# Ejecutar script (ya hecho)
node backend/scripts/migrarDatos.js

# Importa:
# - 3 Plantillas
# - 60+ Opciones
```

---

## 📞 Soporte

Revisa:
- ¿Node.js instalado? → `node --version`
- ¿Puerto libre? → `netstat -ano | findstr :5000`
- ¿Archivo correos.db existe? → `backend/data/correos.db`
- ¿Frontend compilado? → `frontend/build/`

---

## 📄 Versión

- **Versión**: 1.0 Portable
- **Tipo**: Aplicación Offline-First
- **Última actualización**: Febrero 2026

---

**¡Gracias por usar Correos Automatizados! 🎉**
