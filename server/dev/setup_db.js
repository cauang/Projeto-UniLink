import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  try {
    // Ler o arquivo SQL
    const sql = await fs.readFile(join(__dirname, 'password_resets.sql'), 'utf8');
    
    // Executar o script
    await pool.query(sql);
    console.log('Tabela password_resets criada com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
  } finally {
    await pool.end();
  }
}

// REMOVED: setup_db diagnostic script. DB schema changes should be executed via
// proper migration tooling. This placeholder avoids accidental re-run.