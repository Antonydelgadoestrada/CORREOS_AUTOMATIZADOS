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
      SELECT id, destinatario, asunto, contenido, contenido_html, productor, fecha_envio
      FROM correos_enviados
      ORDER BY fecha_envio DESC
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

// Obtener firma empresa
const obtenerFirma = (req, res) => {
  console.log('✅ obtenerFirma endpoint called');
  try {
    const stmt = db.prepare(`
      SELECT id, nombre, cargo, contenido_html, imagen_base64, nombre_imagen, empresa_nombre, telefono, email, web, actualizado_en
      FROM firma_empresa
      LIMIT 1
    `);
    
    const firma = stmt.get();

    if (!firma) {
      return res.json(null);
    }

    res.json(firma);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo firma' });
  }
};

// Actualizar/crear firma empresa
const actualizarFirma = (req, res) => {
  try {
    const { nombre, cargo, contenido_html, imagen_base64, nombre_imagen, empresa_nombre, telefono, email, web } = req.body;

    // Verificar si ya existe firma
    const existente = db.prepare('SELECT id FROM firma_empresa LIMIT 1').get();

    if (existente) {
      // Actualizar
      const stmt = db.prepare(`
        UPDATE firma_empresa
        SET nombre = ?, cargo = ?, contenido_html = ?, imagen_base64 = ?, nombre_imagen = ?, empresa_nombre = ?, telefono = ?, email = ?, web = ?, actualizado_en = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run(nombre, cargo, contenido_html, imagen_base64, nombre_imagen, empresa_nombre, telefono, email, web, existente.id);
      
      return res.json({
        mensaje: 'Firma actualizada exitosamente',
        id: existente.id
      });
    } else {
      // Crear nueva
      const stmt = db.prepare(`
        INSERT INTO firma_empresa (nombre, cargo, contenido_html, imagen_base64, nombre_imagen, empresa_nombre, telefono, email, web)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(nombre, cargo, contenido_html, imagen_base64, nombre_imagen, empresa_nombre, telefono, email, web);
      
      res.status(201).json({
        mensaje: 'Firma creada exitosamente',
        id: result.lastInsertRowid
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { enviarCorreoController, obtenerCorreosEnviados, obtenerEventosInspecciones, obtenerInspeccionesPorMes, reprogramarInspeccion, obtenerFirma, actualizarFirma };
