import { pool } from "../../configs/database.connection.config.mjs";

const sql = `UPDATE todolist_simple SET is_done = NOT is_done WHERE user_id = ? AND id = ? ;`;

export default async function updateOneIsDone({ user_id, id }) {
  return await pool.execute(sql, [user_id, id]);
}
