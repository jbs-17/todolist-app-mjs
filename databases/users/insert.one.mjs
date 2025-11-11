import { pool } from "../../configs/database.connection.config.mjs";

const sql = `INSERT INTO users(email, password, username) VALUES(?, ? , ?)`;


export default async function insertOne({ email, password, username }) {
  return await pool.execute(sql, [email, password, username])
}




/*

[
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 1,
    info: '',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]



  [
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 5,
    info: '',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

Error: Duplicate entry 'jbs@email.com' for key 'users.uq_users_email'
    at PromisePool.execute (D:\code\projects\todolist-app-mjs\node_modules\mysql2\lib\promise\pool.js:54:22)
    at insertUser (file:///D:/code/projects/todolist-app-mjs/database/insert.user.mjs:6:21)
    at file:///D:/code/projects/todolist-app-mjs/index.mjs:8:22
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  code: 'ER_DUP_ENTRY',
  errno: 1062,
  sql: 'INSERT INTO users(email, password, username) VALUES(?, ? , ?)',
  sqlState: '23000',
  sqlMessage: "Duplicate entry 'jbs@email.com' for key 'users.uq_users_email'"
}


Error: Duplicate entry 'woi@email.com' for key 'users.uq_users_email'
    at PromisePool.execute (D:\code\projects\todolist-app-mjs\node_modules\mysql2\lib\promise\pool.js:54:22)
    at insertUser (file:///D:/code/projects/todolist-app-mjs/database/insert.user.mjs:6:21)
    at file:///D:/code/projects/todolist-app-mjs/index.mjs:8:22
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  code: 'ER_DUP_ENTRY',
  errno: 1062,
  sql: 'INSERT INTO users(email, password, username) VALUES(?, ? , ?)',
  sqlState: '23000',
  sqlMessage: "Duplicate entry 'woi@email.com' for key 'users.uq_users_email'"
}


 */