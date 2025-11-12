import { pool } from "../../configs/database.connection.config.mjs";

const sql = `SELECT * FROM todolist_simple WHERE id = ? ;`;

export default async function findByid({ id }) {
  return await pool.execute(sql, [id]);
}
