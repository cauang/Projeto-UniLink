import pool from '../db.js';

async function listTables() {
  try {
      // const res = await pool.query(
      //   `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'unilink' ORDER BY table_name`
      // );
      // console.log('Tables in schema unilink:');
      // res.rows.forEach(r => console.log(`- ${r.table_schema}.${r.table_name}`));
  } catch (err) {
    console.error('Error listing tables:', err);
  } finally {
    await pool.end();
  }
}

listTables();
  // REMOVED: diagnostic script. This file was used temporarily to inspect DB schema and
  // has been retained as an inert placeholder to avoid accidental re-execution.
  // If you need the original script, retrieve it from the Git history.
