const db = require('../config/database');

const enviarCorreoController = (req, res) => {
  const { destinatario, asunto, contenido, productor, contenido_html } = req.body;

  try {
    // Validar datos
    if (!destinatario || !asunto || !contenido) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    // Guardar en base de datos local SQLite - texto plano + HTML opcional
    const stmt = db.prepare(`
      INSERT INTO correos_enviados (destinatario, asunto, productor, contenido, contenido_html, fecha_envio)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const result = stmt.run(destinatario, asunto, productor, contenido, contenido_html || null);

    res.status(201).json({
      mensaje: 'Correo registrado exitosamente',
      id: result.lastInsertRowid,
      destinatario,
      productor,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los correos enviados
const obtenerCorreosEnviados = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, destinatario, asunto, contenido, contenido_html, productor, fecha_envio, creado_en
      FROM correos_enviados
      ORDER BY fecha_envio DESC, creado_en DESC
    `);
    
    const correos = stmt.all();

    res.json(correos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo correos' });
  }
};

// Obtener eventos de inspecciones para el calendario
const obtenerEventosInspecciones = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        id, 
        titulo,
        fecha_inicio, 
        fecha_fin,
        estado,
        descripcion,
        creado_en
      FROM eventos_inspecciones
      ORDER BY fecha_inicio DESC
    `);
    
    const eventos = stmt.all();

    res.json(eventos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo eventos' });
  }
};

// Obtener inspecciones de un mes específico (para reporte)
const obtenerInspeccionesPorMes = (req, res) => {
  try {
    const { anio, mes } = req.query;
    
    if (!anio || !mes) {
      return res.status(400).json({ error: 'Año y mes requeridos' });
    }

    const stmt = db.prepare(`
      SELECT 
        id, 
        titulo,
        fecha_inicio, 
        fecha_fin,
        estado,
        descripcion,
        creado_en
      FROM eventos_inspecciones
      WHERE strftime('%Y', fecha_inicio) = ?
      AND strftime('%m', fecha_inicio) = ?
      ORDER BY fecha_inicio ASC
    `);
    
    const inspecciones = stmt.all(
      String(anio).padStart(4, '0'),
      String(mes).padStart(2, '0')
    );

    res.json(inspecciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo inspecciones por mes' });
  }
};

// Reprogramar una inspección
const reprogramarInspeccion = (req, res) => {
  try {
    const { id, fecha_inicio, fecha_fin } = req.body;

    if (!id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'ID, fecha_inicio y fecha_fin son requeridos' });
    }

    const stmt = db.prepare(`
      UPDATE eventos_inspecciones
      SET 
        fecha_inicio = ?,
        fecha_fin = ?,
        estado = 'reprogramada'
      WHERE id = ?
    `);
    
    const result = stmt.run(fecha_inicio, fecha_fin, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inspección no encontrada' });
    }

    // Recuperar el evento actualizado
    const getStmt = db.prepare(`
      SELECT id, titulo, fecha_inicio, fecha_fin, estado
      FROM eventos_inspecciones
      WHERE id = ?
    `);
    const evento = getStmt.get(id);

    res.json({
      mensaje: 'Inspección reprogramada exitosamente',
      evento
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { enviarCorreoController, obtenerCorreosEnviados, obtenerEventosInspecciones, obtenerInspeccionesPorMes, reprogramarInspeccion };
