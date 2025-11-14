import EventEmitter from "node:events";
import userRepositories from "../repositories/users/index.mjs";
import { isEmail } from "validator";
import ValidationError from "../errors/validation.error.mjs";
import isNullish from "../utils/isNullish.mjs";
import isValidPassword from "../utils/isValidPassword.mjs";
import randomUsername from "../utils/randomUsername.mjs";
import hashPassword from "../utils/hashPassword.mjs";
import DataAlreadyExistsError from "../errors/data.already.exists.error.mjs";
import LOGGER from "../configs/logger.config.mjs";
import DataNotExistsError from "../errors/data.not.exists.error.mjs";

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
      LOGGER.error({
        message: "Unhandled DB Error during user creation:",
        error
      });
      throw error;
    }
  }


  async deleteUser({ id }) {
    // guard
    if (isNullish(id))
      throw new ValidationError("id fields required");

    try {
      const [QueryResult] = await userRepositories.deleteOne({ id });

      // @ts-ignore
      if (QueryResult.affectedRows === 1) {
        return {
          succes: true,
          // @ts-ignore
          affectedRows: QueryResult.affectedRows
        };
      } else {
        throw new DataNotExistsError('targeted user by id to delete not found!', 'id', id);
      }


    } catch (error) {
      LOGGER.error({
        message: "Unhandled DB Error during user deletion:",
        error,
        id
      });
      throw error;
    }
  }


  async updatePassword({ id, oldPassword, newPassword }) {
    // Guard 
    if (isNullish(id, oldPassword, newPassword)) {
      throw new ValidationError("id, oldPassword, and newPassword fields required");
    }

    isValidPassword(newPassword);



    try {
      const user = (await userRepositories.findById(id))[0];
      if (!user) {
        throw new DataNotExistsError('targeted user not found!', 'id', id);
      }
      
      // cek authority 
      const isMatch = await comparePassword(oldPassword, user.password);

      if (!isMatch) {
        // 401 Unauthorized/400 Bad Request
        throw new ValidationError('Old password does not match.', 'oldPassword', null, 401);
      }

      const newPasswordHash = await hashPassword(newPassword);

      const [QueryResult] = await userRepositories.updatePassword({ id, newPassword: newPasswordHash });
      // @ts-ignore
      if (QueryResult.affectedRows === 1) {
        return {
          succes: true,
          // @ts-ignore
          affectedRows: QueryResult.affectedRows
        };
      } else {
        throw new UpadeError('error while updated user password!', 'id', id);
      }
    } catch (error) {
      LOGGER.error({
       'label': 'service',
        message: "Unhandled DB Error during user deletion:",
        error,
        id
      });
      throw error;
    }

  }



}

export default new UserServices();
