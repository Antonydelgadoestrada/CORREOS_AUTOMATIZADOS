# 📧 Sistema de Gestión de Auditorías - Agroexportadora

**Sistema interno web para gestionar el envío de notificaciones de auditorías y llevar control centralizado de inspecciones en una empresa agroexportadora.**

Sistema completamente funcional que automatiza la comunicación de auditorías internas y externas, generación de órdenes de trabajo, y seguimiento de inspecciones en un calendario interactivo.

---

## 🎯 Características Principales

### 📧 Envío de Correos
- ✅ **3 Plantillas Personalizables**:
  - **Planificación Interna**: Para coordinación dentro de la empresa
  - **Planificación Externa**: Para comunicación con productores/clientes
  - **Orden de Trabajo**: Asignación de tareas de auditoría con detalles de formación
- ✅ Campos dinámicos que varían según plantilla seleccionada
- ✅ Integración directa con Outlook (abre en nueva pestaña)
- ✅ Guardado automático en base de datos
- ✅ Contenido en formato texto plano limpio (sin HTML en historial)

### 📅 Calendario Interactivo
- ✅ Visualización de días ocupados por auditorías
- ✅ Código de colores: Azul (programada) / Verde (completada)
- ✅ Click en evento muestra detalles completos
- ✅ Creación automática de eventos al enviar correos
- ✅ Información visible: operador, auditor, fechas, norma, alcance, etc.

### 📊 Historial y Filtros
- ✅ Tabla completa de correos enviados
- ✅ **Filtros avanzados**:
  - Búsqueda por productor
  - Búsqueda por destinatario
  - Filtro por tipo de plantilla
  - Rango de fechas (desde-hasta)
- ✅ Panel lateral con detalles completos de cada correo
- ✅ Contador dinámico de resultados

### ⚙️ Panel de Administración
- ✅ Gestión de opciones en dropdowns:
  - Normas (NOP, RTPO, 848PT, JAS, BIOSUISSE, LPO, GLOBALG.A.P.)
  - Alcances (Producción, Procesamiento, Empaque, Almacenamiento, Transporte)
  - Modalidades (Presencial, Remota, Híbrida)
  - Auditores
  - Tipos de auditoría
- ✅ Agregar/Eliminar opciones en tiempo real
- ✅ Sincronización inmediata con base de datos

---

## 📋 Stack Tecnológico

### Frontend
- **React** - Framework UI
- **Material-UI (MUI)** - Componentes y estilos
- **FullCalendar** - Calendario interactivo
- **Fetch API** - Comunicación con backend

### Backend
- **Node.js + Express** - Servidor API REST
- **PostgreSQL (pg)** - Cliente de base de datos
- **CORS** - Configuración para localhost

### Base de Datos
- **Supabase** - PostgreSQL en la nube
  - 4 tablas: `plantillas`, `opciones`, `correos_enviados`, `eventos_inspecciones`

### Deploy
- **Frontend**: Vercel (listo para deploy)
- **Backend**: Render/Railway (listo para deploy)
- **Base de Datos**: Supabase (ya en producción)

---

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- NPM o Yarn
- Cuenta en Supabase
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/CORREOS_AUTOMATIZADOS.git
cd CORREOS_AUTOMATIZADOS
```

### 2. Configurar Base de Datos

#### Crear proyecto en Supabase
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar credenciales de conexión
4. Ejecutar el script SQL:

```bash
# Copiar contenido de plantillas_schema.sql
# Ejecutarlo en el editor SQL de Supabase
```

### 3. Configurar Backend

```bash
cd backend
npm install
```

**Crear archivo `.env`**:
```env
DB_HOST=tu_host_supabase
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=postgres
DB_PORT=5432
PORT=5000
SENDGRID_API_KEY=tu_api_key_opcional
```

**Iniciar servidor**:
```bash
npm start
# Servidor en http://localhost:5000
```

### 4. Configurar Frontend

```bash
cd frontend
npm install
npm start
# Aplicación en http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
CORREOS_AUTOMATIZADOS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Conexión Supabase
│   │   ├── controllers/
│   │   │   ├── emailController.js   # Lógica de correos
│   │   │   ├── opcionesController.js # Opciones CRUD
│   │   │   └── eventosController.js  # Eventos de inspecciones
│   │   ├── routes/
│   │   │   └── emailRoutes.js       # Definición de rutas API
│   │   ├── utils/
│   │   │   └── nodemailer.js        # Config Nodemailer (no usado)
│   │   └── index.js                 # Punto de entrada
│   ├── package.json
│   └── .env                          # Variables de entorno
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmailForm.js         # Formulario 3 plantillas
│   │   │   ├── Calendar.js          # Calendario eventos
│   │   │   ├── HistorialCorreos.js  # Tabla + filtros
│   │   │   └── AdminOpciones.js     # Panel de opciones
│   │   ├── utils/
│   │   │   └── apiService.js        # Funciones API
│   │   ├── App.js                   # Navegación principal
│   │   ├── App.css
│   │   └── index.js                 # Punto de entrada
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── plantillas_schema.sql            # Script BD (3 plantillas + datos)
├── database.sql                     # Backup BD
└── README.md                        # Este archivo
```

---

## 🌐 Endpoints API

### Correos
- `POST /api/enviar-correo` - Guardar nuevo correo
- `GET /api/correos-enviados` - Obtener historial de correos

### Eventos
- `GET /api/eventos-inspecciones` - Obtener todos los eventos
- `POST /api/eventos-inspecciones` - Crear evento de inspección

### Opciones
- `GET /api/opciones` - Obtener opciones de dropdowns
- `POST /api/opciones` - Agregar nueva opción
- `DELETE /api/opciones` - Eliminar opción

---

## 🎨 Componentes Principales

### EmailForm.js (679 líneas)
- Selector de 3 plantillas
- Campos condicionales según plantilla
- Cálculo automático de fecha fin (incluye día de inicio)
- Generación de contenido texto plano
- Integración mailto para Outlook
- Creación automática de evento en calendario

### HistorialCorreos.js (250+ líneas)
- Tabla de correos enviados
- Sistema de filtros avanzados
- Panel lateral con detalles completos
- Preservación de saltos de línea en vista previa

### Calendar.js (210+ líneas)
- Carga eventos desde BD
- Códigos de color (azul/verde)
- Dialog con información del evento
- Formateo de fechas en español

### AdminOpciones.js (130+ líneas)
- Interfaz para CRUD de opciones
- Sincronización inmediata BD
- Visualización de opciones por categoría

---

## 🚀 Uso del Sistema

### Enviar Auditoría Interna
1. Seleccionar "Planificación Interna"
2. Llenar campos: operador, auditor, fechas, etc.
3. Click "Abrir en Outlook"
4. Correo se registra en historial
5. Evento se crea en calendario automáticamente

### Consultar Historial
1. Ir a tab "Historial"
2. Usar filtros para buscar
3. Click "Ver" para detalles completos

### Ver Auditorías en Calendario
1. Ir a tab "Calendario"
2. Los días ocupados se muestran con color
3. Click en evento para ver detalles

### Gestionar Opciones
1. Ir a tab "Opciones" (ícono engranaje)
2. Seleccionar categoría
3. Agregar/Eliminar opciones según necesario

---

## ⚡ Características Técnicas Importantes

### Cálculo de Fechas
- Conteo de días de inspección **INCLUYE el día de inicio**
- Ejemplo: 21/11 + 3 días = 21, 22, 23 (fin en 23/11)

### Formato de Contenido
- Emails guardados en **texto plano** (sin etiquetas HTML)
- Saltos de línea preservados en historial
- Compatible con cliente de correo predeterminado

### Seguridad
- Variables de entorno para credenciales
- CORS configurado para localhost
- Sin exposición de datos sensibles en frontend

### Performance
- Carga lazy de eventos en calendario
- Filtros locales sin re-query (excepto datos iniciales)
- UI responsiva en móvil/tablet

---

## 🔄 Flujo Completo de Uso

```
1. Usuario llena formulario con datos auditoría
   ↓
2. Selecciona plantilla (Interna/Externa/Orden Trabajo)
   ↓
3. Click "Abrir en Outlook"
   ↓
4. Backend: Guarda correo en BD (correos_enviados)
   ↓
5. Backend: Crea evento en calendario (eventos_inspecciones)
   ↓
6. Frontend: Abre mailto en nueva pestaña
   ↓
7. Usuario visualiza correo en Outlook
   ↓
8. Eventos visibles en calendar y historial
```

---

## 🐛 Solución de Problemas

### Error: "Error de conexión a BD"
- Verificar credenciales Supabase en `.env`
- Confirmar que IP está en whitelist de Supabase
- Reiniciar servidor backend

### Outlook no abre
- Verificar que Outlook esté instalado
- Algunos bloqueadores podrían interferir
- Probar en navegador diferente

### Eventos no aparecen en calendario
- Verificar que haya correos enviados
- Recargar página (F5)
- Ver consola del navegador para errores

---

## 📝 Variables de Entorno

### Backend (.env)
```env
# Supabase
DB_HOST=db.xxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=postgres
DB_PORT=5432

# Servidor
PORT=5000

# Opcional
SENDGRID_API_KEY=tu_clave_opcional
```

### Frontend
Sin `.env` necesario - Usa localhost:5000 por defecto

---

## 📄 Licencia

Proyecto interno para uso exclusivo de agroexportadora.

---

## 👨‍💻 Autor

Desarrollado para gestión de auditorías de certificación orgánica y trazabilidad.

---

## 📞 Soporte

Para reportar bugs o sugerencias, contactar al equipo de desarrollo.

---

**Última actualización**: 23 de Noviembre de 2025
```

Editar `.env` con tus credenciales:

```env
DB_HOST=tu-proyecto.supabase.co
DB_USER=postgres
DB_PASSWORD=tu-contraseña
DB_NAME=postgres
DB_PORT=5432
PORT=5000
EMAIL_USER=tu-correo@outlook.com
EMAIL_PASSWORD=tu-contraseña-app
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### 4. Crear Base de Datos en Supabase

1. Ve a [Supabase](https://supabase.com/)
2. Crea una nueva cuenta/proyecto
3. Ve a SQL Editor y ejecuta el script `database.sql`

---

## 🏃 Ejecutar Proyecto

### Backend

```bash
cd backend
npm run dev
```

El servidor correrá en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm start
```

La aplicación se abrirá en `http://localhost:3000`

---

## 📁 Estructura de Carpetas

```
correos_automatizados/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── emailController.js
│   │   ├── routes/
│   │   │   └── emailRoutes.js
│   │   ├── services/
│   │   │   └── emailService.js
│   │   ├── utils/
│   │   │   └── nodemailer.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmailForm.js
│   │   │   ├── Calendar.js
│   │   │   └── HistorialCorreos.js
│   │   ├── utils/
│   │   │   └── apiService.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── database.sql
```

---

## 🔐 Configurar Contraseña de Aplicación en Outlook

1. Ve a [https://account.microsoft.com/security](https://account.microsoft.com/security)
2. Ve a "Seguridad avanzada"
3. Crea una contraseña de aplicación
4. Usa esa contraseña en `.env` como `EMAIL_PASSWORD`

---

## 📚 API Endpoints

### Enviar Correo
```
POST /api/enviar-correo
Body: {
  "destinatario": "email@ejemplo.com",
  "asunto": "Título",
  "contenido": "Contenido del correo",
  "productor": "Nombre del productor"
}
```

### Salud del Servidor
```
GET /api/health
```

---

## 🚢 Deploy

### Frontend (Vercel)
1. Ve a [Vercel](https://vercel.com/)
2. Conecta tu repositorio de GitHub
3. Deploy automático

### Backend (Render)
1. Ve a [Render](https://render.com/)
2. Crea nuevo Web Service
3. Conecta tu repositorio
4. Variables de entorno: Copia las de `.env`

---

## 📝 Notas

- Las credenciales de BD y email están en `.env` (no commitear a GitHub)
- Para desarrollo local, asegúrate de que el backend esté corriendo antes de iniciar el frontend

---

## 👤 Autor

Desarrollado para agroexportadora.

---

## 📧 Soporte

Para más información, revisa la documentación de:
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/docs)
