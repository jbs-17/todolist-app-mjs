import { pool } from "../../configs/database.connection.config.mjs";

const sql = `
SELECT * FROM todolist_simple
WHERE user_id = ? ;`;

export default async function findTodosByUserId({ user_id }) {
  return pool.execute(sql, [user_id]);
}
