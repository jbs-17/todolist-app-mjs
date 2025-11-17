import { pool } from "../../configs/database.connection.config.mjs";

const sql = `
UPDATE todolist_simple SET 
title = ?, 
description = ?, 
start_time = ?, 
end_time = ?,
is_done = ? 
WHERE id = ? AND user_id = ? ;`;

export default async function updateFullById({
  id,
  title,
  description = "",
  start_time = null,
  end_time = null,
  is_done = 0,
  user_id,
}) {
  return await pool.execute(sql, [
    title,
    description,
    start_time,
    end_time,
    is_done,
    id,
    user_id,
  ]);
}
