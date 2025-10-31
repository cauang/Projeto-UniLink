import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carrega explicitamente o .env que está dentro da pasta /server
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres.svjsyicgprqelhocufwy',
  password: 'Unilink_Unifor', 
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

// Adiciona listener de erro na pool
pool.on('error', (err) => {
  console.error('Erro inesperado na pool do banco de dados:', err);
});

// Testa a conexão
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conexão com o banco estabelecida com sucesso!');
  }
});

export default pool;