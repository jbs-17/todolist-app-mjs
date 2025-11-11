import { pool } from "../../configs/database.connection.config.mjs";

const sql = `
UPDATE todolist_simple SET
title = ?,
description = ? 
WHERE id = ? ;
`;

export default async function updateTitleAndDescription({
    title,
    description,
    id
}) {
    return await pool.execute(sql, [title, description, id]);
}