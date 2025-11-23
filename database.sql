-- Tabla para registrar correos enviados
CREATE TABLE correos_enviados (
  id SERIAL PRIMARY KEY,
  destinatario VARCHAR(255) NOT NULL,
  asunto VARCHAR(255) NOT NULL,
  contenido TEXT,
  productor VARCHAR(255),
  fecha_envio TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para eventos de calendario (inspecciones)
CREATE TABLE eventos_calendario (
  id SERIAL PRIMARY KEY,
  productor VARCHAR(255) NOT NULL,
  tipo_inspeccion VARCHAR(100),
  descripcion TEXT,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'programada',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para plantillas de correos
CREATE TABLE plantillas_correos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100),
  contenido TEXT NOT NULL,
  variables VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_correos_productor ON correos_enviados(productor);
CREATE INDEX idx_correos_fecha ON correos_enviados(fecha_envio);
CREATE INDEX idx_eventos_productor ON eventos_calendario(productor);
CREATE INDEX idx_eventos_fecha ON eventos_calendario(fecha_inicio);
