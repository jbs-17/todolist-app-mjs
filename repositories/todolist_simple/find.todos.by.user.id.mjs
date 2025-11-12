import { pool } from "../../configs/database.connection.config.mjs";

const sql = `
SELECT * FROM todolist_simple as t 
LEFT JOIN users as u 
ON t.user_id = u.user_id 
WHERE u.user_id = ? ;`;

export default async function findTodosByUserId({ id }) {
  return pool.execute(sql, [id]);
}
