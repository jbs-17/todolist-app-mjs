import { pool } from "../../configs/database.connection.config.mjs";

const sql = `INSERT INTO todolist_simple (user_id, title, description ) VALUES (? , ? , ?) ;`;

export default async function insertOne({ user_id, title, description = "" }) {
  return await pool.execute(sql, [user_id, title, description]);
}
