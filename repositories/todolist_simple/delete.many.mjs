// repositories\todolist_simple\delete.many.mjs
import { pool } from "../../configs/database.connection.config.mjs";

// Fungsi utilitas ini tidak diperlukan lagi. Kita bisa membuatnya sebaris.
// function loopPreparedStatements(length = 1) { ... }

function sql(ids = []) {
  // Membangun string "?, ?, ?" secara elegan dan aman
  const placeholders = ids.map(() => "?").join(", ");

  // Jika array kosong, kita biarkan SQL gagal (tapi Service Layer sudah mencegahnya)
  if (placeholders.length === 0)
    return `DELETE FROM todolist_simple WHERE id IN (NULL)`;

  const sql = `DELETE FROM todolist_simple WHERE id IN (${placeholders});`;
  return sql;
}

export default async function deleteMany({ ids = [] }) {
  // Tetap menggunakan fungsi sql() yang sudah direvisi
  return await pool.execute(sql(ids), ids);
}
