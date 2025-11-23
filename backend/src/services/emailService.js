const pool = require('../config/database');

// Obtener todos los correos
const obtenerCorreos = async () => {
  const result = await pool.query('SELECT * FROM correos_enviados ORDER BY fecha_envio DESC');
  return result.rows;
};

// Obtener correos por productor
const obtenerCorreosPorProductor = async (productor) => {
  const result = await pool.query(
    'SELECT * FROM correos_enviados WHERE productor = $1 ORDER BY fecha_envio DESC',
    [productor]
  );
  return result.rows;
};

// Guardar evento en calendario
const guardarEventoCalendario = async (productor, tipo_inspeccion, fecha_inicio, fecha_fin) => {
  const result = await pool.query(
    `INSERT INTO eventos_calendario (productor, tipo_inspeccion, fecha_inicio, fecha_fin)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [productor, tipo_inspeccion, fecha_inicio, fecha_fin]
  );
  return result.rows[0];
};

module.exports = {
  obtenerCorreos,
  obtenerCorreosPorProductor,
  guardarEventoCalendario,
};
