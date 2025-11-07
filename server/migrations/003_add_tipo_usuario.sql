-- Add tipo_usuario column to unilink.usuario if it doesn't exist
ALTER TABLE IF EXISTS unilink.usuario
  ADD COLUMN IF NOT EXISTS tipo_usuario VARCHAR(20) DEFAULT 'Estudante';

-- Ensure existing rows get a default value if the DB doesn't apply defaults retroactively
UPDATE unilink.usuario SET tipo_usuario = 'Estudante' WHERE tipo_usuario IS NULL;
