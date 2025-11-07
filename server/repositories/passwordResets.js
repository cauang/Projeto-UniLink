import pool from '../db.js';

export async function createPasswordReset(userId, token, expiresAt) {
  return pool.query(
    'INSERT INTO unilink.password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
}

export async function findPasswordResetByToken(token) {
  const res = await pool.query('SELECT id, user_id, expires_at FROM unilink.password_resets WHERE token = $1', [token]);
  return res.rows[0];
}

export async function deletePasswordResetsByUserId(userId) {
  return pool.query('DELETE FROM unilink.password_resets WHERE user_id = $1', [userId]);
}
