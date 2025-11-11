import { pool } from "../../configs/database.connection.config.mjs";

const sql = `UPDATE users SET password = ? WHERE id = ? ;`;

export default async function updatePassword({ newPassword, id }) {
  return await pool.execute(sql, [newPassword, id]);

}

/*
gagal
[
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: 'Rows matched: 0  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

sukses
[
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 1  Warnings: 0',        
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 1
  },
  undefined
]

*/
