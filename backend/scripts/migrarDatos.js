const Database = require('better-sqlite3');
const path = require('path');

// Conectar a la BD
const dbPath = path.join(__dirname, '../data/correos.db');
const db = new Database(dbPath);

// Datos de plantillas a migrar
const plantillas = [
  {
    id: 1,
    nombre: "Planificación Interna",
    asunto: "Programación de auditoría – Planificación Interna",
    contenido_html: "<h2>Planificación Interna</h2>\r\n<p><strong>Operador:</strong> {operador}</p>\r\n<p><strong>Número de operador:</strong> {numero_operador}</p>\r\n<p><strong>Fecha de auditoría:</strong> {fecha_inicio} hasta {fecha_fin}</p>\r\n<p><strong>Número de días de inspección:</strong> {dias_inspeccion}</p>\r\n<p><strong>Auditor:</strong> {auditor}</p>\r\n<p><strong>Norma:</strong> {norma}</p>\r\n<p><strong>Alcance:</strong> {alcance}</p>\r\n<p><strong>Tipo:</strong> {tipo}</p>\r\n<p><strong>Modalidad:</strong> {modalidad}</p>\r\n<p><strong>Cultivo/Producto:</strong> {cultivo_producto}</p>\r\n<p><strong>Lugar:</strong> {lugar}</p>\r\n<p><strong>Análisis:</strong> {analisis}</p>\r\n<p><strong>Viáticos:</strong> {viaticos}</p>\r\n<p><strong>Persona de contacto:</strong> {persona_contacto}</p>"
  },
  {
    id: 2,
    nombre: "Planificación Externa",
    asunto: "Programación de auditoría – Planificación Externa",
    contenido_html: "<h2>Planificación Externa</h2>\r\n<p>Se está programando una auditoría para su representada según el siguiente detalle:</p>\r\n<p><strong>Operador:</strong> {operador}</p>\r\n<p><strong>Número de operador:</strong> {numero_operador}</p>\r\n<p><strong>Fecha de auditoría:</strong> {fecha_inicio}</p>\r\n<p><strong>Número de días de inspección:</strong> {dias_inspeccion}</p>\r\n<p><strong>Norma:</strong> {norma}</p>\r\n<p><strong>Alcance:</strong> {alcance}</p>\r\n<p><strong>Tipo:</strong> {tipo}</p>\r\n<p><strong>Modalidad:</strong> {modalidad}</p>\r\n<p><strong>Cultivo/Producto:</strong> {cultivo_producto}</p>\r\n<p><strong>Lugar:</strong> {lugar}</p>\r\n<p><strong>Viáticos:</strong> {viaticos}</p>"
  },
  {
    id: 3,
    nombre: "Orden de Trabajo",
    asunto: "Asignación de Orden de Trabajo",
    contenido_html: "<h2>Orden de Trabajo</h2>\r\n<p><strong>Operador:</strong> {operador}</p>\r\n<p><strong>Número de operador:</strong> {numero_operador}</p>\r\n<p><strong>Fecha:</strong> {fecha_inicio}</p>\r\n<p><strong>Número de días de inspección:</strong> {dias_inspeccion}</p>\r\n<p><strong>Auditor:</strong> {auditor}</p>\r\n<p><strong>Norma:</strong> {norma}</p>\r\n<p><strong>Alcance:</strong> {alcance}</p>\r\n<p><strong>Tipo:</strong> {tipo}</p>\r\n<p><strong>Formación Interna - Tema:</strong> {tema_formacion}</p>\r\n<p><strong>Fecha:</strong> {fecha_formacion}</p>\r\n<p><strong>Horario:</strong> {horario_formacion}</p>\r\n<p><strong>Responsable:</strong> {responsable_formacion}</p>"
  }
];

// Datos de opciones a migrar
const opciones = [
  { id: 31, categoria: "Auditor", opcion: "JOSE LUIS MONTOYA MUJICA" },
  { id: 32, categoria: "Auditor", opcion: "WENDOLY JESUS OBLITAS PINEDO" },
  { id: 33, categoria: "Auditor", opcion: "DANIEL RODRIGO LAM CANCIO" },
  { id: 34, categoria: "Auditor", opcion: "JUAN DIEGO BOLO VALLADARES" },
  { id: 35, categoria: "Auditor", opcion: "JUAN MANUEL ESPEJO BRONCANO" },
  { id: 36, categoria: "Auditor", opcion: "ORSI MARCOS QUISPE HUASCO" },
  { id: 37, categoria: "Auditor", opcion: "OTMAR PAUL SEMINARIO CALLE" },
  { id: 38, categoria: "Auditor", opcion: "RODRIGO NINO VASQUEZ ORTEGA" },
  { id: 39, categoria: "Auditor", opcion: "JAN SANCHEZ LEON" },
  { id: 40, categoria: "Auditor", opcion: "LUIS ROLANDO RAMIREZ LUNA" },
  { id: 41, categoria: "Auditor", opcion: "FRANK JUNIOR ALVARADO RIVERA" },
  { id: 42, categoria: "Auditor", opcion: "YOND HERNAN LAURA HIJAR" },
  { id: 43, categoria: "Auditor", opcion: "ROISER HORACIO RAMOS LEIVA" },
  { id: 44, categoria: "Norma", opcion: "ORGANICO (848PT, NOP, RTPO)" },
  { id: 45, categoria: "Norma", opcion: "ORGANICO (848PT, NOP, RTPO, JAS)" },
  { id: 46, categoria: "Norma", opcion: "ORGANICO (848PT, NOP, RTPO, JAS, BIOSUISSE)" },
  { id: 47, categoria: "Norma", opcion: "ORGANICO (848PT, NOP, RTPO, LPO)" },
  { id: 48, categoria: "Norma", opcion: "ORGANICO (848PT, NOP, RTPO, LPO, JAS)" },
  { id: 49, categoria: "Norma", opcion: "ORGANICO (NOP)" },
  { id: 50, categoria: "Norma", opcion: "ORGANICO (RTPO)" },
  { id: 51, categoria: "Norma", opcion: "ORGANICO (848PT)" },
  { id: 52, categoria: "Norma", opcion: "ORGANICO (JAS)" },
  { id: 53, categoria: "Norma", opcion: "ORGANICO (BIOSUISSE)" },
  { id: 54, categoria: "Norma", opcion: "ORGANICO (NOP, RTPO, LPO)" },
  { id: 55, categoria: "Norma", opcion: "ORGANICO (NOP, RTPO)" },
  { id: 56, categoria: "Norma", opcion: "ORGANICO (848PT, RTPO)" },
  { id: 57, categoria: "Norma", opcion: "GLOBALG.A.P." },
  { id: 58, categoria: "Norma", opcion: "GLOBALG.A.P. + GRASP" },
  { id: 59, categoria: "Norma", opcion: "GLOBALG.A.P. + FSMA" },
  { id: 60, categoria: "Norma", opcion: "GLOBALG.A.P. + SPRING" },
  { id: 61, categoria: "Norma", opcion: "GLOBALG.A.P. + GRASP + FSMA" },
  { id: 62, categoria: "Norma", opcion: "GLOBALG.A.P. + FSMA + SPRING" },
  { id: 63, categoria: "Norma", opcion: "GLOBALG.A.P. + GRASP + FSMA + SPRING" },
  { id: 64, categoria: "Norma", opcion: "CADENA DE CUSTODIA (CoC)" },
  { id: 65, categoria: "Norma", opcion: "GRASP" },
  { id: 66, categoria: "Norma", opcion: "FSMA" },
  { id: 71, categoria: "Alcance", opcion: "GRUPO DE PRODUCTORES" },
  { id: 72, categoria: "Alcance", opcion: "AGRICULTURA" },
  { id: 73, categoria: "Alcance", opcion: "INDUSTRIA" },
  { id: 74, categoria: "Alcance", opcion: "INSUMOS" },
  { id: 75, categoria: "Alcance", opcion: "TRANSFORMACION" },
  { id: 76, categoria: "Alcance", opcion: "COMERCIALIZACION" },
  { id: 77, categoria: "Alcance", opcion: "PROCESSING" },
  { id: 78, categoria: "Alcance", opcion: "REPACKER" },
  { id: 79, categoria: "Alcance", opcion: "PRODUCCION VEGETAL" },
  { id: 80, categoria: "Alcance", opcion: "PRODUCCION VEGETAL GRUPO" },
  { id: 81, categoria: "Alcance", opcion: "PROCESAMIENTO" },
  { id: 82, categoria: "Alcance", opcion: "GRUPO DE PRODUCTORES + INDUSTRIA" },
  { id: 83, categoria: "Alcance", opcion: "AGRICULTURA + INDUSTRIA" },
  { id: 84, categoria: "Alcance", opcion: "GRUPO DE PRODUCTORES + COMERCIALIZACION" },
  { id: 85, categoria: "Alcance", opcion: "GLOBALG.A.P.Opc 1" },
  { id: 86, categoria: "Alcance", opcion: "GLOBALG.A.P.Opc 2" },
  { id: 87, categoria: "Alcance", opcion: "GLOBALG.A.P.Opc 1 multisitios" },
  { id: 88, categoria: "Alcance", opcion: "GLOBALG.A.P.Opc 1 multisitios con SGC" },
  { id: 89, categoria: "Alcance", opcion: "CADENA DE CUSTODIA" },
  { id: 90, categoria: "Alcance", opcion: "PRODUCCION VEGETAL + PROCESAMIENTO" },
  { id: 91, categoria: "Alcance", opcion: "PRODUCCION VEGETAL GRUPO + PROCESAMIENTO" },
  { id: 92, categoria: "Modalidad", opcion: "IN SITU" },
  { id: 93, categoria: "Modalidad", opcion: "TELEMATICO" },
  { id: 94, categoria: "Modalidad", opcion: "TELEMATICO + IN SITU" }
];

try {
  console.log('🔄 Iniciando migración de datos...\n');

  // Insertar plantillas
  const insertPlantillaStmt = db.prepare(`
    INSERT OR IGNORE INTO plantillas (id, nombre, asunto, contenido_html, creado_en)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  let plantillasInsertadas = 0;
  plantillas.forEach(plantilla => {
    const result = insertPlantillaStmt.run(
      plantilla.id,
      plantilla.nombre,
      plantilla.asunto,
      plantilla.contenido_html
    );
    if (result.changes > 0) {
      plantillasInsertadas++;
      console.log(`   ✅ Plantilla: ${plantilla.nombre}`);
    }
  });

  // Insertar opciones
  const insertOpcionStmt = db.prepare(`
    INSERT OR IGNORE INTO opciones (id, categoria, valor, creado_en)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);

  let opcionesInsertadas = 0;
  opciones.forEach(opcion => {
    const result = insertOpcionStmt.run(opcion.id, opcion.categoria, opcion.opcion);
    if (result.changes > 0) {
      opcionesInsertadas++;
    }
  });

  console.log(`\n✅ Migración completada:`);
  console.log(`   📝 Plantillas insertadas: ${plantillasInsertadas}`);
  console.log(`   📝 Opciones insertadas: ${opcionesInsertadas}`);
  console.log(`   📊 Total de registros: ${plantillasInsertadas + opcionesInsertadas}\n`);
  console.log(`✨ Base de datos actualizada: ${dbPath}`);

  db.close();
} catch (error) {
  console.error('❌ Error durante la migración:', error);
  db.close();
  process.exit(1);
}
