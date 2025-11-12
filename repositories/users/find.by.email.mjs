import { pool } from "../../configs/database.connection.config.mjs";
const sql = `SELECT * FROM users WHERE email = ? ;`;

export async function findByEmail({ email }) {
  return await pool.execute(sql, [email]);
}
