import pool from '../db.js';

async function upsertUser(nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia) {
  const q = `SELECT id_usuario FROM unilink.usuario WHERE matricula = $1`;
  const res = await pool.query(q, [matricula]);
  if (res.rows.length > 0) return res.rows[0].id_usuario;
  const insert = `INSERT INTO unilink.usuario (nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia, horas_complementares, avaliacao)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,0) RETURNING id_usuario`;
  const r = await pool.query(insert, [nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia]);
  return r.rows[0].id_usuario;
}

async function upsertProcedimentoByTitle(titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id) {
  const sel = `SELECT id FROM unilink.procedimentos WHERE titulo = $1 AND data = $2 LIMIT 1`;
  const found = await pool.query(sel, [titulo, data]);
  if (found.rows.length > 0) return found.rows[0].id;
  const ins = `INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) RETURNING id`;
  const r = await pool.query(ins, [titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id]);
  return r.rows[0].id;
}

async function upsertInscricao(procedimento_id, voluntario_id, status, created_at=null) {
  const q = `SELECT 1 FROM unilink.inscricoes WHERE procedimento_id = $1 AND voluntario_id = $2 LIMIT 1`;
  const exists = await pool.query(q, [procedimento_id, voluntario_id]);
  if (exists.rows.length > 0) return false;
  if (created_at) {
    await pool.query(`INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$4)`, [procedimento_id, voluntario_id, status, created_at]);
  } else {
    await pool.query(`INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status) VALUES ($1,$2,$3)`, [procedimento_id, voluntario_id, status]);
  }
  return true;
}

async function run() {
  try {
    // users
    const id1 = await upsertUser('Maria Silva','20250001','Odontologia','maria.silva@edu.unifor.br','(85)99999-0001',6,'senha_placeholder','Estudante','Estudante de Odontologia');
    const id2 = await upsertUser('João Santos','20250002','Odontologia','joao.santos@edu.unifor.br','(85)99999-0002',5,'senha_placeholder','Estudante','Estudante de Odontologia');
    const id3 = await upsertUser('Ana Costa','20250003','Odontologia','ana.costa@edu.unifor.br','(85)99999-0003',4,'senha_placeholder','Estudante','Estudante de Odontologia');
    const vol = await upsertUser('Voluntário Demo','20259999','Ciência da Computação','voluntario.demo@edu.unifor.br','(85)99999-9999',7,'senha_placeholder','Voluntario','Conta de demonstração para voluntários');

    // procedimentos available
    const p1 = await upsertProcedimentoByTitle('Limpeza e Profilaxia','Procedimento de higiene bucal','', '', '2025-10-18', '14:00:00', '1h30min','Clínica Odontológica - Bloco A','disponivel', id1);
    const p2 = await upsertProcedimentoByTitle('Exame Periodontal','Avaliação periodontal','', '', '2025-10-20', '10:00:00', '1h','Clínica Odontológica - Bloco B','disponivel', id2);
    const p3 = await upsertProcedimentoByTitle('Aplicação de Flúor','Aplicação tópica de flúor','', '', '2025-10-22', '15:30:00', '45min','Clínica Odontológica - Bloco A','disponivel', id3);

    // histórico procedimentos
    const h1 = await upsertProcedimentoByTitle('Limpeza e Profilaxia (Histórico)','Procedimento histórico','', '', '2025-09-15', '09:00:00', '1h','Clínica Odontológica - Bloco A','concluido', id1);
    const h2 = await upsertProcedimentoByTitle('Exame Clínico (Histórico)','Procedimento histórico','', '', '2025-08-20', '11:00:00', '1h','Clínica Odontológica - Bloco B','concluido', id2);
    const h3 = await upsertProcedimentoByTitle('Aplicação de Flúor (Histórico)','Procedimento histórico','', '', '2025-07-10', '14:00:00', '45min','Clínica Odontológica - Bloco A','concluido', id3);

    // inscricoes linking volunteer to historical items
    await upsertInscricao(h1, vol, 'concluido', '2025-09-15');
    await upsertInscricao(h2, vol, 'concluido', '2025-08-20');
    await upsertInscricao(h3, vol, 'concluido', '2025-07-10');

    // optionally a current inscription
    await upsertInscricao(p1, vol, 'confirmado');

    console.log('Seed applied (idempotent)');
  } catch (err) {
    console.error('seed error:', err);
  } finally {
    await pool.end();
  }
}

run();
