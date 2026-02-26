const db = require('../config/database');

// Crear evento de inspección
const crearEventoInspeccion = (req, res) => {
  const { 
    titulo,
    operador,
    numero_operador,
    fecha_inicio, 
    fecha_fin,
    dias_inspeccion,
    auditor,
    norma,
    alcance,
    tipo,
    modalidad,
    cultivo_producto,
    lugar,
    persona_contacto,
    estado,
    descripcion
  } = req.body;

  try {
    // Validar datos requeridos
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Falta fecha_inicio y fecha_fin' });
    }

    // Crear título si no viene
    const eventoTitulo = titulo || `Auditoría - ${operador || 'Sin especificar'}`;

    const stmt = db.prepare(`
      INSERT INTO eventos_inspecciones 
      (titulo, operador, numero_operador, fecha_inicio, fecha_fin, dias_inspeccion, auditor, norma, alcance, tipo, modalidad, cultivo_producto, lugar, persona_contacto, estado, descripcion, creado_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const result = stmt.run(
      eventoTitulo,
      operador || '',
      numero_operador || '',
      fecha_inicio,
      fecha_fin,
      dias_inspeccion || 1,
      auditor || '',
      norma || '',
      alcance || '',
      tipo || '',
      modalidad || '',
      cultivo_producto || '',
      lugar || '',
      persona_contacto || '',
      estado || 'Programada',
      descripcion || ''
    );

    // Obtener el evento creado
    const getStmt = db.prepare(`
      SELECT * FROM eventos_inspecciones WHERE id = ?
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
