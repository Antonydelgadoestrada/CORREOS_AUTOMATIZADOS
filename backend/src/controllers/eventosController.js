const pool = require('../config/database');

// Crear evento de inspección
const crearEventoInspeccion = async (req, res) => {
  const { 
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
    persona_contacto
  } = req.body;

  try {
    // Validar datos requeridos
    if (!operador || !fecha_inicio || !auditor) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    const query = `
      INSERT INTO eventos_inspecciones 
      (operador, numero_operador, fecha_inicio, fecha_fin, dias_inspeccion, auditor, norma, alcance, tipo, modalidad, cultivo_producto, lugar, persona_contacto, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'programada')
      RETURNING id, operador, numero_operador, fecha_inicio, fecha_fin, dias_inspeccion, auditor, norma, alcance, tipo, modalidad, cultivo_producto, lugar, persona_contacto, estado;
    `;
    
    const result = await pool.query(query, [
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
      persona_contacto
    ]);

    res.status(201).json({
      mensaje: 'Evento de inspección creado exitosamente',
      evento: result.rows[0],
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crearEventoInspeccion };
