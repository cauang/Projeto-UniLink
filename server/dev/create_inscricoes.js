import pool from '../db.js';

async function createInscricoes() {
  try {
    const sql = `
    CREATE TABLE IF NOT EXISTS unilink.inscricoes (
      id SERIAL PRIMARY KEY,
      procedimento_id INTEGER REFERENCES unilink.procedimento(id_procedimento) ON DELETE CASCADE,
      voluntario_id INTEGER REFERENCES unilink.usuario(id_usuario) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'confirmado',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;
    await pool.query(sql);
    console.log('unilink.inscricoes created (if not existed)');
  } catch (err) {
    console.error('Error creating inscricoes:', err);
  } finally {
    await pool.end();
    // REMOVED: diagnostic script to create inscricoes table.
    // This script was used for local debugging during investigation. The DB changes
    // it performed are either applied (during development) or should be migrated via
    // proper SQL migration tooling. Kept as an inert placeholder in case history is needed.
