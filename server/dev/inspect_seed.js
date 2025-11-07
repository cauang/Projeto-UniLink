import pool from '../db.js';

async function inspect() {
  try {
    const proc = await pool.query("SELECT id, titulo, data FROM unilink.procedimentos ORDER BY data DESC");
    console.log('Procedimentos:');
    console.table(proc.rows);

    const inscr = await pool.query("SELECT i.id, i.procedimento_id, p.titulo AS procedimento_titulo, i.voluntario_id, u.nome AS voluntario_nome, i.status FROM unilink.inscricoes i LEFT JOIN unilink.procedimentos p ON i.procedimento_id = p.id LEFT JOIN unilink.usuario u ON i.voluntario_id = u.id_usuario ORDER BY i.created_at DESC");
    console.log('Inscricoes:');
    console.table(inscr.rows);
  } catch (err) {
    console.error('Inspect error:', err);
  } finally {
    await pool.end();
  }
}

inspect();
