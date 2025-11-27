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

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nome, email, telefone, curso, semestre, biografia } = req.body;

    // Basic validation
    if (!nome || !email) {
      return res.status(400).json({ message: 'Nome e E-mail são obrigatórios.' });
    }

    const updateQuery = `
      UPDATE unilink.usuario
      SET
        nome = $1,
        email = $2,
        telefone = $3,
        curso = $4,
        semestre = $5,
        biografia = $6
      WHERE id_usuario = $7
      RETURNING id_usuario, matricula, nome, curso, email, telefone, semestre, biografia, horas_complementares, avaliacao, tipo_usuario;
    `;

    const values = [nome, email, telefone, curso, semestre, biografia, req.userId];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
    }

    const updatedUser = result.rows[0];

    // This logic is repeated from the GET route, might be good to refactor later
    if (updatedUser.tipo_usuario) {
      updatedUser.tipo_usuario = String(updatedUser.tipo_usuario).toLowerCase().includes('volunt') ? 'Voluntario' : 'Estudante';
    } else {
      try {
        const isVol = await isVoluntarioByUserId(updatedUser.id_usuario);
        updatedUser.tipo_usuario = isVol ? 'Voluntario' : 'Estudante';
      } catch (err) {
        console.error('Erro ao determinar tipo de usuário após update:', err);
        updatedUser.tipo_usuario = 'Estudante';
      }
    }


    res.json(updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    // Check for unique constraint violation (e.g., email already exists)
    if (err.code === '23505') { // PostgreSQL unique violation error code
        return res.status(409).json({ message: 'O endereço de e-mail já está em uso.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
