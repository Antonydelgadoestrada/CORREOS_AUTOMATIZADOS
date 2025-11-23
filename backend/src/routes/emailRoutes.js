const express = require('express');
const router = express.Router();
const { enviarCorreoController, obtenerCorreosEnviados, obtenerEventosInspecciones } = require('../controllers/emailController');
const { obtenerOpciones, agregarOpcion, eliminarOpcion } = require('../controllers/opcionesController');
const { crearEventoInspeccion } = require('../controllers/eventosController');

// Ruta para enviar correo
router.post('/enviar-correo', enviarCorreoController);

// Ruta para obtener correos enviados
router.get('/correos-enviados', obtenerCorreosEnviados);

// Ruta para obtener eventos de inspecciones
router.get('/eventos-inspecciones', obtenerEventosInspecciones);

// Ruta para crear evento de inspección
router.post('/eventos-inspecciones', crearEventoInspeccion);

// Rutas para opciones
router.get('/opciones', obtenerOpciones);
router.post('/opciones', agregarOpcion);
router.delete('/opciones', eliminarOpcion);

module.exports = router;
