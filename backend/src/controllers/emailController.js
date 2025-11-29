const pool = require('../config/database');

const enviarCorreoController = async (req, res) => {
  const { destinatario, asunto, contenido, productor, contenidoHTML } = req.body;

  try {
    // Validar datos
    if (!destinatario || !asunto || !contenido) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    // Guardar en base de datos Supabase con texto plano y HTML
    const query = `
      INSERT INTO correos_enviados (destinatario, asunto, productor, contenido, contenido_html, fecha_envio)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, destinatario, asunto, productor, fecha_envio;
    `;
    
    const result = await pool.query(query, [destinatario, asunto, productor, contenido, contenidoHTML || contenido]);

    res.status(201).json({
      mensaje: 'Correo registrado exitosamente',
      id: result.rows[0].id,
      destinatario: result.rows[0].destinatario,
      productor: result.rows[0].productor,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los correos enviados
const obtenerCorreosEnviados = async (req, res) => {
  try {
    const query = `
      SELECT id, destinatario, asunto, contenido, contenido_html, productor, fecha_envio, created_at
      FROM correos_enviados
      ORDER BY fecha_envio DESC NULLS LAST, created_at DESC;
    `;
    
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo correos' });
  }
};

// Obtener eventos de inspecciones para el calendario
const obtenerEventosInspecciones = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
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
        estado
      FROM eventos_inspecciones
      ORDER BY fecha_inicio DESC;
    `;
    
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo eventos' });
  }
};

module.exports = { enviarCorreoController, obtenerCorreosEnviados, obtenerEventosInspecciones };
