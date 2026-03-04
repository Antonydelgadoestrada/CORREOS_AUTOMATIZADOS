require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  // Si no es /api, servir el index.html de React
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
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
