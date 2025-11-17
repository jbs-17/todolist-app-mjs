import { pool } from "../../configs/database.connection.config.mjs";

const sql = `DELETE FROM todolist_simple WHERE user_id = ? AND id = ? ;`;

export default async function deleteOne({ user_id, id }) {
  return await pool.execute(sql, [user_id, id]);
}
