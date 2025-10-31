import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id_usuario, matricula, nome, curso, email, telefone, semestre, biografia, horas_complementares, avaliacao FROM unilink.usuario WHERE id_usuario = $1',
      [req.userId]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
