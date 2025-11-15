import bcrypt from "bcryptjs";

export default async function comparePassword(
  password = "",
  passwordHash = "",
) {
  if (typeof password !== "string" || typeof passwordHash !== "string")
    throw new TypeError("password type must be string");
  if (password.length <= 0 || passwordHash.length <= 0)
    throw new Error("password length <= 0");

  return await bcrypt.compare(password, passwordHash);
}
