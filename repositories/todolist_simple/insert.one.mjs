// repositories/todolist_simple/insert.one.mjs
import { pool } from "../../configs/database.connection.config.mjs";

const sql = `INSERT INTO todolist_simple 
( user_id, title, description, is_done, start_time, end_time ) 
VALUES ( ? , ? , ?, ?, ?, ? ) ;`; // <-- PERBAIKAN: Hanya 6 placeholder

export default async function insertOne({
  user_id,
  title,
  description,
  is_done,
  start_time,
  end_time,
}) {
  return await pool.execute(sql, [
    user_id,
    title,
    description,
    is_done,
    start_time,
    end_time,
  ]);
}
