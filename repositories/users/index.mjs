import deleteOne from "./delete.one.mjs";
import insertOne from "./insert.one.mjs";
import updateEmail from "./update.email.mjs";
import updatePassword from "./update.password.mjs";
import updateUsername from "./update.username.mjs";

const userRepositories = {
  insertOne,
  deleteOne,
  updateEmail,
  updatePassword,
  updateUsername,
};

export default userRepositories;
