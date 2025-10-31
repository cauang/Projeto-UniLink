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
import './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// monta rotas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// health check
app.get('/', (req, res) => res.json({ ok: true }));

// error handler global (impede crash inteiro)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));