import pool from '../db.js';

async function inspect() {
  try {
    const procCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='unilink' AND table_name='procedimentos'");
    console.log('procedimentos columns:');
    console.table(procCols.rows);

    const inscrCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='unilink' AND table_name='inscricoes'");
    console.log('inscricoes columns:');
    console.table(inscrCols.rows);

    const procTable = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='unilink'");
    console.log('tables in schema unilink:');
    console.table(procTable.rows);
  } catch (err) {
    console.error('inspect schema error:', err);
  } finally {
    await pool.end();
  }
}

inspect();
