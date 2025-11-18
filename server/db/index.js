import pool from '../db.js';

// Re-export the existing pool both as default and named export.
// This allows importing from 'server/db' or '../db' consistently.
export default pool;
export { pool };
