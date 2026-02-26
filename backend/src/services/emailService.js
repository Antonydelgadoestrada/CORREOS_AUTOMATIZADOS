const db = require('../config/database');

// Obtener todos los correos
const obtenerCorreos = () => {
  const stmt = db.prepare('SELECT * FROM correos_enviados ORDER BY fecha_envio DESC');
  return stmt.all();
};

// Obtener correos por productor
const obtenerCorreosPorProductor = (productor) => {
  const stmt = db.prepare(
    'SELECT * FROM correos_enviados WHERE productor = ? ORDER BY fecha_envio DESC'
  );
  return stmt.all(productor);
};

// Guardar evento en calendario
const guardarEventoCalendario = (productor, tipo_inspeccion, fecha_inicio, fecha_fin) => {
  const stmt = db.prepare(`
    INSERT INTO eventos_inspecciones (titulo, fecha_inicio, fecha_fin, descripcion)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(productor, fecha_inicio, fecha_fin, tipo_inspeccion);
  return { id: result.lastInsertRowid };
};

module.exports = {
  obtenerCorreos,
  obtenerCorreosPorProductor,
  guardarEventoCalendario,
};
