const pool = require('../config/database');

// Obtener todas las opciones
const obtenerOpciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT categoria, opcion FROM opciones ORDER BY categoria, opcion');
    
    const opciones = {};
    result.rows.forEach(row => {
      if (!opciones[row.categoria]) {
        opciones[row.categoria] = [];
      }
      opciones[row.categoria].push(row.opcion);
    });

    res.json(opciones);
  } catch (error) {
    console.error('Error obteniendo opciones:', error);
    res.status(500).json({ error: 'Error obteniendo opciones' });
  }
};

// Agregar nueva opción
const agregarOpcion = async (req, res) => {
  try {
    const { categoria, opcion } = req.body;

    if (!categoria || !opcion) {
      return res.status(400).json({ error: 'Categoría y opción son requeridas' });
    }

    // Verificar si ya existe
    const existente = await pool.query(
      'SELECT * FROM opciones WHERE categoria = $1 AND opcion = $2',
      [categoria, opcion]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ error: 'La opción ya existe' });
    }

    // Insertar nueva opción
    await pool.query(
      'INSERT INTO opciones (categoria, opcion) VALUES ($1, $2)',
      [categoria, opcion]
    );

    res.json({ success: true, message: `Opción "${opcion}" agregada a ${categoria}` });
  } catch (error) {
    console.error('Error agregando opción:', error);
    res.status(500).json({ error: 'Error agregando opción' });
  }
};

// Eliminar opción
const eliminarOpcion = async (req, res) => {
  try {
    const { categoria, opcion } = req.body;

    if (!categoria || !opcion) {
      return res.status(400).json({ error: 'Categoría y opción son requeridas' });
    }

    await pool.query(
      'DELETE FROM opciones WHERE categoria = $1 AND opcion = $2',
      [categoria, opcion]
    );

    res.json({ success: true, message: `Opción "${opcion}" eliminada` });
  } catch (error) {
    console.error('Error eliminando opción:', error);
    res.status(500).json({ error: 'Error eliminando opción' });
  }
};

module.exports = { obtenerOpciones, agregarOpcion, eliminarOpcion };
