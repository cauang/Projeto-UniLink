import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../db.js';
import { sendResetEmail } from '../services/mailer.js';

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { nome, curso, matricula, email, telefone, senha, semestre, biografia } = req.body;
  if (!nome || !curso || !matricula || !email || !senha || !semestre) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
  }
  try {
    const exists = await pool.query(
      'SELECT 1 FROM unilink.usuario WHERE matricula = $1 OR email = $2',
      [matricula, email]
    );
    if (exists.rows.length > 0) return res.status(409).json({ message: 'Matrícula ou e-mail já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      `INSERT INTO unilink.usuario (nome, curso, matricula, email, telefone, senha, semestre, biografia, horas_complementares, avaliacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0.00)`,
      [nome, curso, matricula, email, telefone, hash, semestre, biografia]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

// login
router.post('/login', async (req, res) => {
  const { matricula, senha } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM unilink.usuario WHERE matricula = $1', [matricula]);
    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ message: 'Matrícula ou senha incorreta' });

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ message: 'Matrícula ou senha incorreta' });

    const token = jwt.sign({
      id: user.id_usuario,
      matricula: user.matricula,
      nome: user.nome,
      curso: user.curso,
      email: user.email,
    }, process.env.JWT_SECRET || 'sua_chave_secreta', { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email é obrigatório' });
  try {
    const userResult = await pool.query('SELECT id_usuario, email, matricula FROM unilink.usuario WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) return res.json({ message: 'Se o e-mail existir, você receberá instruções para resetar a senha.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await pool.query('INSERT INTO unilink.password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id_usuario, token, expiresAt]);

    const frontUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontUrl}/reset-password?token=${token}`;

    await sendResetEmail(user.email, resetLink);
    return res.json({ message: 'Se o e-mail existir, você receberá instruções para resetar a senha.' });
  } catch (err) {
    console.error('Erro em forgot-password:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
});

// validate-reset
router.get('/validate-reset', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token é obrigatório' });
  try {
    const row = await pool.query('SELECT id, user_id, expires_at FROM unilink.password_resets WHERE token = $1', [token]);
    const pr = row.rows[0];
    if (!pr) return res.status(404).json({ message: 'Token inválido' });
    if (new Date(pr.expires_at) < new Date()) return res.status(410).json({ message: 'Token expirado' });
    return res.json({ ok: true, user_id: pr.user_id });
  } catch (err) {
    console.error('Erro validate-reset:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
});

// reset-password
router.post('/reset-password', async (req, res) => {
  const { token, senha } = req.body;
  if (!token || !senha) return res.status(400).json({ message: 'Token e senha são obrigatórios' });
  try {
    const row = await pool.query('SELECT id, user_id, expires_at FROM unilink.password_resets WHERE token = $1', [token]);
    const pr = row.rows[0];
    if (!pr) return res.status(404).json({ message: 'Token inválido' });
    if (new Date(pr.expires_at) < new Date()) return res.status(410).json({ message: 'Token expirado' });

    const hash = await bcrypt.hash(senha, 10);
    await pool.query('UPDATE unilink.usuario SET senha = $1 WHERE id_usuario = $2', [hash, pr.user_id]);
    await pool.query('DELETE FROM unilink.password_resets WHERE user_id = $1', [pr.user_id]);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    console.error('Erro reset-password:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
});

export default router;
