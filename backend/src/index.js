require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// CORS configurado para desarrollo y producción
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL || 'https://correos-automatizados.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middlewares — límite 10mb para soportar imágenes base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas API (ANTES de archivos estáticos y React)
app.get('/api/health', (req, res) => {
  res.json({ mensaje: 'Backend funcionando correctamente' });
});

// Log all requests to /api
app.use('/api', (req, res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// Rutas de email
app.use('/api', emailRoutes);

// 404 handler para /api que no existen
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
});

// Servir archivos estáticos del frontend compilado DESPUÉS de las rutas /api
const frontendBuildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(frontendBuildPath));

// Middleware para servir React en cualquier ruta que no sea /api
app.use((req, res, next) => {
  // Si la ruta empieza con /api, ir al siguiente middleware (404)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
  }
  // Si no es /api, servir el index.html de React si existe
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Sistema de Correos Automatizados</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; text-align: center; background-color: #f8fafc; color: #1e293b; }
          .card { max-width: 600px; margin: 0 auto; background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
          h2 { color: #0f172a; margin-top: 0; }
          code { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #0284c7; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🌾 Sistema de Correos - Servidor Backend Activo</h2>
          <p>El backend API está activo y respondiendo correctamente.</p>
          <p>Para cargar la interfaz gráfica, inicia la aplicación mediante <code>iniciar.bat</code> para compilar y servir el frontend.</p>
        </div>
      </body>
    </html>
  `);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`✅ Base de datos SQLite portátil iniciada`);
  console.log(`📱 Accede a: http://localhost:${PORT}`);
});
