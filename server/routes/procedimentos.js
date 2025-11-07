import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Buscar procedimentos agendados do voluntário
router.get('/meus-agendados', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        u.nome as estudante_nome,
        u.email as estudante_email,
        u.telefone as estudante_telefone,
        u.semestre as estudante_semestre
       FROM unilink.procedimentos p
       JOIN unilink.inscricoes i ON p.id = i.procedimento_id
       JOIN unilink.usuario u ON p.estudante_id = u.id_usuario
       WHERE i.voluntario_id = $1 AND i.status = 'confirmado'
       ORDER BY p.data DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar procedimentos agendados:', err);
    res.status(500).json({ message: 'Erro ao buscar procedimentos' });
  }
});

// Buscar procedimentos disponíveis (exclui os que o voluntário já se inscreveu)
router.get('/disponiveis', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        u.nome as estudante_nome,
        u.email as estudante_email,
        u.telefone as estudante_telefone,
        u.semestre as estudante_semestre
       FROM unilink.procedimentos p
       JOIN unilink.usuario u ON p.estudante_id = u.id_usuario
       WHERE p.status = 'disponivel'
       AND NOT EXISTS (
         SELECT 1 FROM unilink.inscricoes i 
         WHERE i.procedimento_id = p.id 
         AND i.voluntario_id = $1
       )
       ORDER BY p.data ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar procedimentos disponíveis:', err);
    res.status(500).json({ message: 'Erro ao buscar procedimentos' });
  }
});

// Buscar histórico de procedimentos (concluídos/cancelados) do voluntário
router.get('/historico', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        i.status as inscricao_status,
        i.created_at as inscricao_data
       FROM unilink.procedimentos p
       JOIN unilink.inscricoes i ON p.id = i.procedimento_id
       WHERE i.voluntario_id = $1 
       AND i.status IN ('concluido', 'cancelado')
       ORDER BY i.created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
});

// Buscar detalhes de um procedimento específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        u.nome as estudante_nome,
        u.email as estudante_email,
        u.telefone as estudante_telefone,
        u.semestre as estudante_semestre,
        i.status as inscricao_status
       FROM unilink.procedimentos p
       JOIN unilink.usuario u ON p.estudante_id = u.id_usuario
       LEFT JOIN unilink.inscricoes i ON p.id = i.procedimento_id AND i.voluntario_id = $1
       WHERE p.id = $2`,
      [req.userId, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Procedimento não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar procedimento:', err);
    res.status(500).json({ message: 'Erro ao buscar procedimento' });
  }
});

// Inscrever-se em um procedimento (transação)
router.post('/inscrever', authMiddleware, async (req, res) => {
  const { procedimentoId } = req.body;
  
  try {
    await pool.query('BEGIN');

    // Verifica se já está inscrito
    const inscrito = await pool.query(
      'SELECT 1 FROM unilink.inscricoes WHERE procedimento_id = $1 AND voluntario_id = $2',
      [procedimentoId, req.userId]
    );
    
    if (inscrito.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Você já está inscrito neste procedimento' });
    }

    // Bloqueia e verifica disponibilidade
    const proc = await pool.query(
      'SELECT status FROM unilink.procedimentos WHERE id = $1 FOR UPDATE',
      [procedimentoId]
    );

    if (proc.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Procedimento não encontrado' });
    }

    if (proc.rows[0].status !== 'disponivel') {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Este procedimento não está mais disponível' });
    }

    // Cria a inscrição
    await pool.query(
      `INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status) VALUES ($1, $2, 'confirmado')`,
      [procedimentoId, req.userId]
    );

    // Atualiza o status do procedimento
    await pool.query('UPDATE unilink.procedimentos SET status = $1 WHERE id = $2', ['agendado', procedimentoId]);

    await pool.query('COMMIT');

    res.json({ message: 'Inscrição realizada com sucesso' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Erro ao realizar inscrição:', err);
    res.status(500).json({ message: 'Erro ao realizar inscrição' });
  }
});

// Cancelar inscrição em um procedimento (transação)
router.post('/cancelar', authMiddleware, async (req, res) => {
  const { procedimentoId } = req.body;
  
  try {
    await pool.query('BEGIN');

    // Verifica se está inscrito e bloqueia a linha
    const inscricao = await pool.query(
      'SELECT id FROM unilink.inscricoes WHERE procedimento_id = $1 AND voluntario_id = $2 AND status = $3 FOR UPDATE',
      [procedimentoId, req.userId, 'confirmado']
    );
    
    if (inscricao.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Você não está inscrito neste procedimento' });
    }

    // Atualiza o status da inscrição
    await pool.query('UPDATE unilink.inscricoes SET status = $1 WHERE id = $2', ['cancelado', inscricao.rows[0].id]);

    // Atualiza o status do procedimento
    await pool.query('UPDATE unilink.procedimentos SET status = $1 WHERE id = $2', ['disponivel', procedimentoId]);

    await pool.query('COMMIT');

    res.json({ message: 'Inscrição cancelada com sucesso' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Erro ao cancelar inscrição:', err);
    res.status(500).json({ message: 'Erro ao cancelar inscrição' });
  }
});

export default router;