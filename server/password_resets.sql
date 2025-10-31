CREATE TABLE IF NOT EXISTS unilink.password_resets (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES unilink.usuario(id_usuario) ON DELETE CASCADE,
  token varchar(256) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
