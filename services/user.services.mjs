import EventEmitter from "node:events";
import userRepositories from "../repositories/users/index.mjs";
import { isEmail } from "validator";
import ValidationError from "../errors/validation.error.mjs";
import isNullish from "../utils/isNullish.mjs";
import isValidPassword from "../utils/isValidPassword.mjs";
import randomUsername from "../utils/randomUsername.mjs";
import hashPassword from "../utils/hashPassword.mjs";
import DataAlreadyExistsError from "../errors/data.already.exists.rrror.mjs";
import LOGGER from "../configs/logger.config.mjs";

class UserServices extends EventEmitter {
  async addNewUser({ email, password }) {
    // guard
    if (isNullish(email, password))
      throw new ValidationError("email and password fields required");

    if (!isEmail(email))
      throw new ValidationError("invalid email format!", "email", email);

    isValidPassword(password);
    const existingUser = await userRepositories.findByEmail(email);
    if (existingUser) {
      throw new DataAlreadyExistsError(
        "Email is already registered.",
        "email",
        email,
      );
    }

    const passwordHash = await hashPassword(password);
    const username = await randomUsername();

    try {
      const [QueryResult] = await userRepositories.insertOne({
        email,
        password: passwordHash,
        username,
      });

      return {
        succes: true,
        username,
        email,
        // @ts-ignore
        insertId: QueryResult.insertId,
      };
    } catch (error) {
      // ... (Logging dan throw error) ...
      LOGGER.error({
        message: "Unhandled DB Error during user creation:",
        error,
      });
      throw error;
    }
  }
}

export default new UserServices();
