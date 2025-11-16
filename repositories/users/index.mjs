// repositories/users/index.mjs

import deleteOne from "./delete.one.mjs";
import { findByEmail } from "./find.by.email.mjs";
import { findById } from "./find.by.id.mjs";
import insertOne from "./insert.one.mjs";
import updateEmail from "./update.email.mjs";
import updatePassword from "./update.password.mjs";
import updateUsername from "./update.username.mjs";

const userRepositories = {
  insertOne,
  deleteOne,
  findById,
  findByEmail,
  updateEmail,
  updatePassword,
  updateUsername,
};

export default userRepositories;
