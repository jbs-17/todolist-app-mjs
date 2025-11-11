import { pool } from "../config/database.connection.config.mjs";



export default async function updateUserPassword(newPassword, id, email, oldPassword) {
  return await pool.execute(`UPDATE users SET password = ? WHERE id = ? AND email = ? AND password= ? ;`, [newPassword, id, email, oldPassword]);
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
