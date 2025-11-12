import { pool } from "../../configs/database.connection.config.mjs";

const sql = `
UPDATE todolist_simple SET 
title = ?, 
description = ?, 
start_time = ?, 
end_time = ?,
is_done = ? 
WHERE id = ? ;`;

export default async function updateById({
  id,
  title,
  description = "",
  start_time = null,
  end_time = null,
  is_done = 0,
}) {
  return await pool.execute(sql, [
    title,
    description,
    start_time,
    end_time,
    is_done,
    id,
  ]);
}
