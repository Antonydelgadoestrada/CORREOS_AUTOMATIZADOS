# 📱 Aplicación Portátil en USB - Correos Automatizados

## ¿Qué es?
Una versión completamente **portátil** de la aplicación que funciona desde una USB sin necesidad de Internet ni servidores en la nube. Todo está integrado en una carpeta.

---

## 🚀 Cómo Usar

### Opción 1: Lo Más Fácil (Recomendado)
1. **Haz doble-clic** en `iniciar.bat`
2. Espera 3 segundos
3. Se abrirá automáticamente en tu navegador
4. ¡Listo! Ya puedes usar la app

### Opción 2: Línea de Comando (Si Opción 1 no funciona)
```bash
cd backend
npm install   (solo primera vez)
npm start
```
Luego abre tu navegador en: http://localhost:5000

### Detener la Aplicación
1. **Haz doble-clic** en `detener.bat`
2. O si usas línea de comando: presiona `Ctrl + C`

---

## 📂 Estructura de Carpetas

```
CORREOS_AUTOMATIZADOS/
├── iniciar.bat               ← Doble-clic para iniciar
├── detener.bat              ← Doble-clic para detener
├── .env                      ← Configuración (no tocar)
├── backend/
│   ├── src/
│   │   ├── index.js         ← Servidor principal
│   │   ├── config/
│   │   │   └── database.js  ← Base de datos SQLite
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── data/
│   │   └── correos.db       ← Base de datos local (se crea automáticamente)
│   └── package.json
├── frontend/
│   └── build/               ← Archivos compilados (se sirven desde backend)
└── README_PORTABLE.md       ← Este archivo
```

---

## 🗄️ Base de Datos

**No hay servidor externo.** Todo funciona con:
- **SQLite**: Base de datos local en `backend/data/correos.db`
- **Archivo**: Un simple archivo `.db` que se copia con la USB

### Copiar/Respaldar Datos
Si quieres respaldar tus emails e inspecciones:
1. Copia `backend/data/correos.db` a una carpeta segura
2. Para restaurar: reemplaza el archivo `correos.db` con tu respaldo

---

## ⚙️ Requisitos

- **Windows 10/11** (o cualquier OS con Node.js)
- **Node.js** (descarga desde https://nodejs.org - La versión estable)
  - Si no lo tienes: Abre `iniciar.bat` primero y te dirá

### ¿No tienes Node.js?
1. Descarga Node.js desde https://nodejs.org
2. Instálalo (todas las opciones por defecto está bien)
3. Reinicia la computadora
4. Usa `iniciar.bat` nuevamente

---

## 🎯 Funcionalidades

✅ **Enviar Correos**
- 3 plantillas de email predefinidas
- Generación de tablas HTML para Outlook
- Almacenamiento en BD local

✅ **Calendario de Inspecciones**
- Ver, crear, y reprogramar inspecciones
- Estados: Programada, En Proceso, Finalizada, Reprogramada
- Colores dinámicos por estado

✅ **Reportes Mensuales**
- Filtrar por mes/año
- Contar inspecciones por estado
- Exportar a CSV (Excel)
- Exportar a PDF (impresión)

✅ **Historial de Correos**
- Buscar por productor, destinatario, fecha
- Ver detalles completos
- Tablas HTML renderizadas correctamente

✅ **Administrador de Opciones**
- Agregar/eliminar opciones en desplegables
- Categorías: Productor, Destinatario, Auditor, Norma, Alcance, etc.

---

## 🐛 Solución de Problemas

### ERROR: "node no es reconocido como comando"
→ Instala Node.js desde https://nodejs.org y reinicia

### La app se abre pero no carga datos
→ Espera 5-10 segundos a que SQLite se inicialice
→ Recarga la página con F5

### Puerto 5000 ya está en uso
→ Edita `.env` y cambia `PORT=5000` a `PORT=5001`
→ Luego abre http://localhost:5001

### ¿Dónde están mis correos guardados?
→ En: `backend/data/correos.db`
→ Respáldalos frecuentemente

---

## 📋 Versiones

- **Nueva (Portátil)**: Esta versión - Todo en una carpeta
- **Anterior (Vercel+Render)**: Disponible en rama `main` de GitHub

---

## 👨‍💼 Uso en Corporativo

Para distribuir a múltiples personas:
1. Copia `CORREOS_AUTOMATIZADOS/` a USB
2. Dale la USB a cada persona
3. Ellos hacen doble-clic en `iniciar.bat`
4. ¡Listo! No necesitan ni Internet ni instalar nada extra

Cada persona tendrá su propia copia independiente.

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: 
- Los datos se guardan en `backend/data/correos.db` (archivo abierto)
- Si es sensible: Respáldalos en un lugar seguro
- Si pierdes la USB: Pierdes los datos (haz copias de seguridad)
- No hay autenticación/login (es local, de escritorio)

---

## 📞 Soporte

¿Problemas? Revisa:
1. ¿Tengo Node.js instalado? (Abre terminal: `node --version`)
2. ¿El puerto 5000 está disponible?
3. ¿Actualizar Node.js a versión estable?

---

**Última actualización**: Febrero 2026
**Versión Portable**: 1.0
