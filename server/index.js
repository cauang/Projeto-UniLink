import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import procedimentosRoutes from './routes/procedimentos.js';
import './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// monta rotas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/procedimentos', procedimentosRoutes);

// health check
app.get('/', (req, res) => res.json({ ok: true }));

// error handler global (impede crash inteiro)
// Trata erros de parsing do body (JSON inválido) de forma clara e retorna 400
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // body-parser sets err.type === 'entity.parse.failed' for JSON parse errors
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    // Evita vazar dados sensíveis em produção; aqui deixamos uma mensagem útil para desenvolvimento
    const bodyPreview = err.body || req.rawBody || undefined;
    return res.status(err.status || 400).json({ message: 'JSON inválido no corpo da requisição', details: bodyPreview });
  }

  // Fallback genérico
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});