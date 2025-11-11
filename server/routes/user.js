import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { isVoluntarioByUserId } from '../repositories/users.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id_usuario, matricula, nome, curso, email, telefone, semestre, biografia, horas_complementares, avaliacao, tipo_usuario FROM unilink.usuario WHERE id_usuario = $1',
      [req.userId]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    // Prioriza o tipo armazenado na tabela `usuario` se presente
    if (user.tipo_usuario) {
      user.tipo_usuario = String(user.tipo_usuario).toLowerCase().includes('volunt') ? 'Voluntario' : 'Estudante';
    } else {
      // Caso não exista, determina baseado nas inscrições
      try {
        const isVol = await isVoluntarioByUserId(user.id_usuario);
        user.tipo_usuario = isVol ? 'Voluntario' : 'Estudante';
      } catch (err) {
        // se houver erro ao checar, não bloqueia a resposta — assume Estudante como fallback
        console.error('Erro ao determinar tipo de usuário:', err);
        user.tipo_usuario = 'Estudante';
      }
    }

    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
