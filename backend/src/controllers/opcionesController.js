const db = require('../config/database');

// Obtener todas las opciones
const obtenerOpciones = (req, res) => {
  try {
    const stmt = db.prepare('SELECT categoria, valor FROM opciones ORDER BY categoria, valor');
    const rows = stmt.all();
    
    const opciones = {};
    rows.forEach(row => {
      if (!opciones[row.categoria]) {
        opciones[row.categoria] = [];
      }
      opciones[row.categoria].push(row.valor);
    });

    res.json(opciones);
  } catch (error) {
    console.error('Error obteniendo opciones:', error);
    res.status(500).json({ error: 'Error obteniendo opciones' });
  }
};

// Agregar nueva opción
const agregarOpcion = (req, res) => {
  try {
    const { categoria, opcion } = req.body;

    // Validar que categoria y opcion no estén vacíos
    if (!categoria || !categoria.trim()) {
      return res.status(400).json({ error: 'La categoría es requerida' });
    }

    if (!opcion || !opcion.trim()) {
      return res.status(400).json({ error: 'La opción no puede estar vacía' });
    }

    // Trimear valores
    const categoriaLimpia = categoria.trim();
    const opcionLimpia = opcion.trim();

    // Verificar si ya existe
    const existente = db.prepare(
      'SELECT * FROM opciones WHERE LOWER(categoria) = LOWER(?) AND LOWER(valor) = LOWER(?)'
    ).get(categoriaLimpia, opcionLimpia);

    if (existente) {
      return res.status(400).json({ error: 'La opción ya existe' });
    }

    // Insertar nueva opción
    const stmt = db.prepare(
      'INSERT INTO opciones (categoria, valor, creado_en) VALUES (?, ?, CURRENT_TIMESTAMP)'
    );
    stmt.run(categoriaLimpia, opcionLimpia);

    res.json({ success: true, message: `Opción "${opcionLimpia}" agregada a ${categoriaLimpia}` });
  } catch (error) {
    console.error('Error agregando opción:', error);
    res.status(500).json({ error: 'Error agregando opción' });
  }
};

// Eliminar opción
const eliminarOpcion = (req, res) => {
  try {
    const { categoria, opcion } = req.body;

    if (!categoria || !opcion) {
      return res.status(400).json({ error: 'Categoría y opción son requeridas' });
    }

    const stmt = db.prepare(
      'DELETE FROM opciones WHERE categoria = ? AND valor = ?'
    );
    stmt.run(categoria, opcion);

    res.json({ success: true, message: `Opción "${opcion}" eliminada` });
  } catch (error) {
    console.error('Error eliminando opción:', error);
    res.status(500).json({ error: 'Error eliminando opción' });
  }
};

module.exports = { obtenerOpciones, agregarOpcion, eliminarOpcion };
