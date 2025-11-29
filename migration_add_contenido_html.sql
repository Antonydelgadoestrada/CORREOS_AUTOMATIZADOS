-- Agregar columna contenido_html a la tabla correos_enviados
ALTER TABLE correos_enviados ADD COLUMN contenido_html TEXT DEFAULT NULL;
