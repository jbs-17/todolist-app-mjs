import { pool } from "../../configs/database.connection.config.mjs";

const sql = `UPDATE users SET email = ? WHERE id = ? ;`;

export default async function updateEmail({ newEmail, id }) {
  return await pool.execute(sql, [newEmail, id]);
}
