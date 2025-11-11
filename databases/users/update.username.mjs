import { pool } from '../../configs/database.connection.config.mjs';

const sql = `UPDATE users SET username = ? WHERE id = ? ;`

export default async function updateUsername({ newUsername, id }) {
  return await pool.execute(sql, [newUsername, id]);
}