import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carrega .env que está na pasta /server explicitamente (executado a partir da raiz do projeto)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

async function test() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.SMTP_TEST_TO || user;

  if (!host || !user || !pass) {
    console.error('Preencha SMTP_HOST, SMTP_USER e SMTP_PASS no .env antes de rodar este teste');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log('SMTP conectado com sucesso');

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Teste SMTP - UniLink',
      text: 'Este é um e-mail de teste do UniLink. Se você o recebeu, o SMTP está funcionando.'
    });

    console.log('E-mail de teste enviado:', info.messageId);
  } catch (err) {
    console.error('Erro ao testar SMTP:', err);
    process.exit(1);
  }
}

test();