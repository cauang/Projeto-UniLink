import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  transporter.verify()
    .then(() => console.log('SMTP verificado com sucesso'))
    .catch((err) => console.warn('Falha ao verificar SMTP:', err && err.message ? err.message : err));
}

export async function sendResetEmail(to, resetLink) {
  if (!transporter) {
    console.log('Reset link (SMTP não configurado):', resetLink);
    return null;
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Redefinição de senha - UniLink',
    html: `<p>Olá,</p><p>Clique no link abaixo para redefinir sua senha (válido por 1 hora):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });

  console.log('Email de reset enviado:', info.messageId);
  return info;
}
