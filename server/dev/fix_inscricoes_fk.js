import pool from '../db.js';

async function fix() {
  try {
    // check constraint exists
    const q = `SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON t.relnamespace = n.oid
      WHERE t.relname = 'inscricoes' AND n.nspname = 'unilink'`;
    const res = await pool.query(q);
    console.log('Found constraints on unilink.inscricoes:');
    console.table(res.rows);

    // drop existing inscricoes_procedimento_id_fkey if exists
    const exists = res.rows.find(r => r.conname === 'inscricoes_procedimento_id_fkey');
    if (exists) {
      console.log('Dropping constraint inscricoes_procedimento_id_fkey');
      await pool.query('ALTER TABLE unilink.inscricoes DROP CONSTRAINT IF EXISTS inscricoes_procedimento_id_fkey');
    }

    // add new constraint referencing unilink.procedimentos(id)
    console.log('Adding new FK constraint referencing unilink.procedimentos(id)');
    await pool.query(`ALTER TABLE unilink.inscricoes
      ADD CONSTRAINT inscricoes_procedimento_id_fkey FOREIGN KEY (procedimento_id) REFERENCES unilink.procedimentos(id) ON DELETE CASCADE`);

    console.log('Constraint updated');
  } catch (err) {
    console.error('fix fk error:', err);
  } finally {
    await pool.end();
  }
}

fix();
