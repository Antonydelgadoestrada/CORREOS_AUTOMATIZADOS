const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Usar BD local portátil en la carpeta del proyecto
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/correos.db');

// Crear directorio data si no existe
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Conectar a SQLite
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS plantillas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    asunto TEXT NOT NULL,
    contenido_html TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS opciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria TEXT NOT NULL,
    valor TEXT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS correos_enviados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plantilla_id INTEGER,
    productor TEXT,
    destinatario TEXT,
    asunto TEXT,
    contenido TEXT,
    contenido_html TEXT,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plantilla_id) REFERENCES plantillas(id)
  );

  CREATE TABLE IF NOT EXISTS eventos_inspecciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado TEXT DEFAULT 'Programada',
    descripcion TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log(`✅ Base de datos SQLite portátil: ${dbPath}`);

module.exports = db;
