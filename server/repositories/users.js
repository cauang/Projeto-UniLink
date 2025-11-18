import pool from '../db.js';

export async function existsUserByMatriculaOrEmail(matricula, email) {
  const res = await pool.query(
    'SELECT 1 FROM unilink.usuario WHERE matricula = $1 OR email = $2',
    [matricula, email]
  );
  return res.rows.length > 0;
}

export async function findByMatricula(matricula) {
  const res = await pool.query('SELECT * FROM unilink.usuario WHERE matricula = $1', [matricula]);
  return res.rows[0];
}

export async function findByEmail(email) {
  const res = await pool.query('SELECT id_usuario, email, matricula FROM unilink.usuario WHERE email = $1', [email]);
  return res.rows[0];
}

export async function createUser({ nome, curso, matricula, email, telefone, senha, semestre, tipo_usuario, biografia }) {
  // Return the inserted user's id to the caller so the route can act on it if needed.
  const res = await pool.query(
    `INSERT INTO unilink.usuario (nome, curso, matricula, email, telefone, senha, semestre, tipo_usuario, biografia, horas_complementares, avaliacao)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0.00) RETURNING id_usuario`,
    // Do not force a default tipo_usuario here — keep null if caller didn't provide it
    [nome, curso, matricula, email, telefone, senha, semestre, (tipo_usuario ?? null), biografia]
  );
  return res.rows[0];
}

export async function isVoluntarioByUserId(userId) {
  // The inscricoes table uses voluntario_id to reference users. Use that column name
  // to check if the user has any inscriptions (is a volunteer).
  const res = await pool.query('SELECT 1 FROM unilink.inscricoes WHERE voluntario_id = $1 LIMIT 1', [userId]);
  return res.rows.length > 0;
}
