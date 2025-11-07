import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../db.js';
import { checkMatricula } from './check-matricula.js';
import { sendResetEmail } from '../services/mailer.js';
import {
  existsUserByMatriculaOrEmail,
  createUser,
  findByMatricula,
  findByEmail,
  isVoluntarioByUserId
} from '../repositories/users.js';
import {
  createPasswordReset,
  findPasswordResetByToken,
  deletePasswordResetsByUserId
} from '../repositories/passwordResets.js';

const router = express.Router();

// check-matricula
router.get('/check-matricula', async (req, res) => {
  const { matricula } = req.query;
  if (!matricula) {
    return res.status(400).json({ message: 'Matrícula é obrigatória' });
  }

  try {
    const result = await checkMatricula(matricula);
    res.json(result);
  } catch (err) {
    console.error('Erro ao verificar matrícula:', err);
    res.status(500).json({ message: 'Erro ao verificar matrícula' });
  }
});

// register
router.post('/register', async (req, res) => {
  const { nome, curso, matricula, email, telefone, senha, semestre, biografia } = req.body;
  if (!nome || !curso || !matricula || !email || !senha || !semestre) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
  }
  try {
    const exists = await existsUserByMatriculaOrEmail(matricula, email);
    if (exists) return res.status(409).json({ message: 'Matrícula ou e-mail já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    try {
      const inserted = await createUser({ nome, curso, matricula, email, telefone, senha: hash, semestre, biografia });
      // Send success and return immediately to avoid later error handling trying to send another response
      return res.status(201).json({ message: 'Usuário cadastrado com sucesso', id_usuario: inserted.id_usuario });
    } catch (insertError) {
      console.error('Erro ao inserir usuário:', insertError);
      throw insertError;
    }
  } catch (err) {
    console.error('Erro no register:', err && err.message ? err.message : err);
    // If a response was already sent (e.g. insert succeeded and we returned), don't try to send another
    if (res.headersSent) return;

    // Se o erro for de chave única (matrícula ou email duplicado)
    if (err && err.code === '23505') {
      return res.status(409).json({ message: 'Matrícula ou e-mail já cadastrado' });
    } else if (err && err.code === '22P02') {
      return res.status(400).json({ message: 'Formato de dado inválido' });
    } else {
      return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  }
});

// login
router.post('/login', async (req, res) => {
  const { matricula, senha } = req.body;
  try {
  const user = await findByMatricula(matricula);
    if (!user) return res.status(401).json({ message: 'Matrícula ou senha incorreta' });

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ message: 'Matrícula ou senha incorreta' });

    // Verifica se o usuário é estudante ou voluntário baseado na tabela inscricoes
    let tipo = 'Estudante';
    try {
      tipo = (await isVoluntarioByUserId(user.id_usuario)) ? 'Voluntario' : 'Estudante';
    } catch (volErr) {
      // Log and continue as Estudante if the check fails
      console.error('Erro ao checar voluntario:', volErr && volErr.message ? volErr.message : volErr);
      tipo = 'Estudante';
    }
    const token = jwt.sign({
      id: user.id_usuario,
      matricula: user.matricula,
      nome: user.nome,
      curso: user.curso,
      email: user.email,
      tipo_usuario: tipo
    }, process.env.JWT_SECRET || 'sua_chave_secreta', { expiresIn: '24h' });
    

    // Remove a senha antes de enviar os dados do usuário
    delete user.senha;
    
    res.json({ 
      token,
      user: {
        ...user,
        tipo_usuario: tipo
      }
    });
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
  const user = await findByEmail(email);
    if (!user) return res.json({ message: 'Se o e-mail existir, você receberá instruções para resetar a senha.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await createPasswordReset(user.id_usuario, token, expiresAt);

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
  const pr = await findPasswordResetByToken(token);
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
  const pr = await findPasswordResetByToken(token);
    if (!pr) return res.status(404).json({ message: 'Token inválido' });
    if (new Date(pr.expires_at) < new Date()) return res.status(410).json({ message: 'Token expirado' });

    const hash = await bcrypt.hash(senha, 10);
  await pool.query('UPDATE unilink.usuario SET senha = $1 WHERE id_usuario = $2', [hash, pr.user_id]);
  await deletePasswordResetsByUserId(pr.user_id);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    console.error('Erro reset-password:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
});

export default router;
