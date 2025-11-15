import { pool } from "../../configs/database.connection.config.mjs";

const sql = `UPDATE todolist_simple SET is_done = NOT is_done WHERE id = ? ;`;

export default async function updateOneIsDone({ id }) {
  return await pool.execute(sql, [id]);
}
