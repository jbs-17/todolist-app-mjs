import bcrypt from "bcryptjs";

export default async function hashPassword(password = "") {
  if (typeof password !== "string")
    throw new TypeError("password type must be string");
  if (password.length <= 0) throw new Error("password length <= 0");

  return await bcrypt.hash(password, "todolist");
}
