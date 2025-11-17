import { pool } from "../../configs/database.connection.config.mjs";
// repositories/todolist_simple/update.title.description.by.id.mjs

// repositories/todolist_simple/update.title.description.by.id.mjs
const sql = `
UPDATE todolist_simple SET
title = ?,
description = ? 
WHERE id = ? AND user_id = ? ;
`; // <-- Urutan kueri sudah benar: 1: title, 2: description, 3: id, 4: user_id

export default async function updateTitleAndDescriptionById({
  user_id,
  title,
  description,
  id,
}) {
  // Parameter: 1: title, 2: description, 3: id, 4: user_id
  // Anda mengirim: [title, description, id, user_id] -> COCOK!
  return await pool.execute(sql, [title, description, id, user_id]);
}
// Kesimpulan: Kode ini sudah benar! Abaikan keraguan sebelumnya.
