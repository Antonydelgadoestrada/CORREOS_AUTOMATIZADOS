-- Tabla de plantillas de correo
CREATE TABLE plantillas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50),
  asunto VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de opciones (Normas, Auditor, Alcance, etc.)
CREATE TABLE opciones (
  id SERIAL PRIMARY KEY,
  categoria VARCHAR(100) NOT NULL,
  opcion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de correos enviados
CREATE TABLE correos_enviados (
  id SERIAL PRIMARY KEY,
  productor VARCHAR(255),
  destinatario VARCHAR(255),
  asunto VARCHAR(255),
  contenido TEXT,
  plantilla_id INT REFERENCES plantillas(id),
  fecha_envio TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de eventos (inspecciones en calendario)
CREATE TABLE eventos_inspecciones (
  id SERIAL PRIMARY KEY,
  operador VARCHAR(255),
  numero_operador VARCHAR(100),
  fecha_inicio DATE,
  fecha_fin DATE,
  dias_inspeccion INT,
  auditor VARCHAR(255),
  norma VARCHAR(100),
  alcance VARCHAR(255),
  tipo VARCHAR(100),
  modalidad VARCHAR(100),
  cultivo_producto VARCHAR(255),
  lugar VARCHAR(255),
  persona_contacto VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'programada',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar plantillas predefinidas
INSERT INTO plantillas (nombre, tipo, asunto, contenido) VALUES
(
  'Planificación Interna',
  'interna',
  'Programación de auditoría – Planificación Interna',
  '<h2>Planificación Interna</h2>
<p><strong>Operador:</strong> {operador}</p>
<p><strong>Número de operador:</strong> {numero_operador}</p>
<p><strong>Fecha de auditoría:</strong> {fecha_inicio} hasta {fecha_fin}</p>
<p><strong>Número de días de inspección:</strong> {dias_inspeccion}</p>
<p><strong>Auditor:</strong> {auditor}</p>
<p><strong>Norma:</strong> {norma}</p>
<p><strong>Alcance:</strong> {alcance}</p>
<p><strong>Tipo:</strong> {tipo}</p>
<p><strong>Modalidad:</strong> {modalidad}</p>
<p><strong>Cultivo/Producto:</strong> {cultivo_producto}</p>
<p><strong>Lugar:</strong> {lugar}</p>
<p><strong>Análisis:</strong> {analisis}</p>
<p><strong>Viáticos:</strong> {viaticos}</p>
<p><strong>Persona de contacto:</strong> {persona_contacto}</p>'
),
(
  'Planificación Externa',
  'externa',
  'Programación de auditoría – Planificación Externa',
  '<h2>Planificación Externa</h2>
<p>Se está programando una auditoría para su representada según el siguiente detalle:</p>
<p><strong>Operador:</strong> {operador}</p>
<p><strong>Número de operador:</strong> {numero_operador}</p>
<p><strong>Fecha de auditoría:</strong> {fecha_inicio}</p>
<p><strong>Número de días de inspección:</strong> {dias_inspeccion}</p>
<p><strong>Norma:</strong> {norma}</p>
<p><strong>Alcance:</strong> {alcance}</p>
<p><strong>Tipo:</strong> {tipo}</p>
<p><strong>Modalidad:</strong> {modalidad}</p>
<p><strong>Cultivo/Producto:</strong> {cultivo_producto}</p>
<p><strong>Lugar:</strong> {lugar}</p>
<p><strong>Viáticos:</strong> {viaticos}</p>'
),
(
  'Orden de Trabajo',
  'orden_trabajo',
  'Asignación de Orden de Trabajo',
  '<h2>Orden de Trabajo</h2>
<p><strong>Operador:</strong> {operador}</p>
<p><strong>Número de operador:</strong> {numero_operador}</p>
<p><strong>Fecha:</strong> {fecha_inicio}</p>
<p><strong>Número de días de inspección:</strong> {dias_inspeccion}</p>
<p><strong>Auditor:</strong> {auditor}</p>
<p><strong>Norma:</strong> {norma}</p>
<p><strong>Alcance:</strong> {alcance}</p>
<p><strong>Tipo:</strong> {tipo}</p>
<p><strong>Formación Interna - Tema:</strong> {tema_formacion}</p>
<p><strong>Fecha:</strong> {fecha_formacion}</p>
<p><strong>Horario:</strong> {horario_formacion}</p>
<p><strong>Responsable:</strong> {responsable_formacion}</p>'
);

-- Insertar opciones predefinidas
INSERT INTO opciones (categoria, opcion) VALUES
-- Normas
('Norma', 'NOP'),
('Norma', 'RTPO'),
('Norma', '848PT'),
('Norma', 'JAS'),
('Norma', 'BIOSUISSE'),
('Norma', 'LPO'),
('Norma', 'GLOBALG.A.P.'),
-- Alcance
('Alcance', 'Producción'),
('Alcance', 'Procesamiento'),
('Alcance', 'Empaque'),
('Alcance', 'Almacenamiento'),
('Alcance', 'Transporte'),
-- Modalidad
('Modalidad', 'Presencial'),
('Modalidad', 'Remota'),
('Modalidad', 'Híbrida'),
-- Auditor (ejemplo - agregar los reales)
('Auditor', 'Auditor 1'),
('Auditor', 'Auditor 2'),
('Auditor', 'Auditor 3'),
('Auditor', 'Auditor 4'),
-- Tipo
('Tipo', 'Inicial'),
('Tipo', 'Seguimiento'),
('Tipo', 'Cambio de alcance'),
('Tipo', 'Re-certificación');

-- Índices para mejorar rendimiento
CREATE INDEX idx_correos_productor ON correos_enviados(productor);
CREATE INDEX idx_correos_fecha ON correos_enviados(fecha_envio);
CREATE INDEX idx_eventos_operador ON eventos_inspecciones(operador);
CREATE INDEX idx_eventos_fecha ON eventos_inspecciones(fecha_inicio);
CREATE INDEX idx_opciones_categoria ON opciones(categoria);
