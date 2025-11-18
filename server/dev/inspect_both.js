import pool from '../db.js';

async function inspect() {
  try {
    const p1 = await pool.query('SELECT id_procedimento, nome_procedimento, data FROM unilink.procedimento ORDER BY id_procedimento');
    console.log('procedimento (singular) rows:');
    console.table(p1.rows);

    const p2 = await pool.query('SELECT id, titulo, data FROM unilink.procedimentos ORDER BY id');
    console.log('procedimentos (plural) rows:');
    console.table(p2.rows);

    const inscr = await pool.query('SELECT * FROM unilink.inscricoes ORDER BY id');
    console.log('inscricoes rows:');
    console.table(inscr.rows);
  } catch (err) {
    console.error('inspect both error:', err);
  } finally {
    await pool.end();
  }
}

inspect();
