import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

async function runMigrations() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  console.log('Migrations dir:', migrationsDir);

  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    if (sqlFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }

    for (const file of sqlFiles) {
      const fullPath = path.join(migrationsDir, file);
      console.log('\n---- Running', file, '----');
      const sql = await fs.readFile(fullPath, 'utf8');
      try {
        // Execute as a single query. Migrations should be idempotent.
        await pool.query(sql);
        console.log(file, 'applied successfully.');
      } catch (err) {
        console.error('Error applying', file, err.message || err);
      }
    }
  } catch (err) {
    console.error('Migration runner error:', err);
  } finally {
    await pool.end();
    console.log('Pool closed.');
  }
}

runMigrations().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
