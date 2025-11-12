import { pool } from "../../configs/database.connection.config.mjs";
const sql = `SELECT * FROM users WHERE id = ? ;`;

export async function findById({ id }) {
  return await pool.execute(sql, [id]);
}
