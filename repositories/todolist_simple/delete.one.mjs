import { pool } from "../../configs/database.connection.config.mjs";

const sql = `DELETE FROM todolist_simple WHERE id = ? ;`;

export default async function deleteOne({ id }) {
  return await pool.execute(sql, [id]);
}
