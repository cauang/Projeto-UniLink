import pool from '../db.js';

async function sync() {
  try {
    // Read rows from legacy 'procedimento' table
    const { rows: legacy } = await pool.query("SELECT * FROM unilink.procedimento");
    console.log('Found', legacy.length, "rows in unilink.procedimento");

    for (const r of legacy) {
      const id = r.id_procedimento;
      const titulo = r.nome_procedimento || r.titulo || 'Sem título';
  const data = r.data || null;
  const horario = r.horario || null;
  // provide safe defaults to satisfy NOT NULL constraints in canonical table
  const duracao = r.duracao ?? 60; // default duration 60 (minutes)
  const local = r.local || '';
  const status = r.status || 'Aberto';
      const estudante_id = r.estudante_id || null;

      // Insert into procedimentos if not exists
      const exists = await pool.query('SELECT 1 FROM unilink.procedimentos WHERE id = $1', [id]);
      if (exists.rows.length === 0) {
        await pool.query(
          `INSERT INTO unilink.procedimentos (id, titulo, data, horario, duracao, local, status, estudante_id, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
          [id, titulo, data, horario, duracao, local, status, estudante_id]
        );
        console.log('Inserted procedimento id', id, '->', titulo);
      } else {
        console.log('procedimento id', id, 'already exists in procedimentos; skipping');
      }
    }
  } catch (err) {
    console.error('sync error:', err);
  } finally {
    await pool.end();
  }
}

sync();
