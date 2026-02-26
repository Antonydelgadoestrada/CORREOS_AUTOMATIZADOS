const db = require('../config/database');

// Crear evento de inspección
const crearEventoInspeccion = (req, res) => {
  const { 
    titulo,
    fecha_inicio, 
    fecha_fin,
    estado,
    descripcion
  } = req.body;

  try {
    // Validar datos requeridos
    if (!titulo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    const stmt = db.prepare(`
      INSERT INTO eventos_inspecciones 
      (titulo, fecha_inicio, fecha_fin, estado, descripcion, creado_en)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const result = stmt.run(
      titulo, 
      fecha_inicio, 
      fecha_fin,
      estado || 'Programada',
      descripcion || ''
    );

    // Obtener el evento creado
    const getStmt = db.prepare(`
      SELECT id, titulo, fecha_inicio, fecha_fin, estado, descripcion
      FROM eventos_inspecciones
      WHERE id = ?
    `);
    const evento = getStmt.get(result.lastInsertRowid);

    res.status(201).json({
      mensaje: 'Evento de inspección creado exitosamente',
      evento,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crearEventoInspeccion };
