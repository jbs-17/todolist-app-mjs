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
import comparePassword from "../utils/comparePassword.mjs";

class UserServices extends EventEmitter {
  /**
   *
   * @param {{ email: string, password : string}}  param0
   * @returns {Promise<{success: true, username : string,email : string,insertId : number }>}
   */
  // * addNewUser
  async addNewUser({ email, password }) {
    // guard
    if (isNullish(email, password))
      throw new ValidationError("email and password fields required");

    if (!isEmail(email))
      throw new ValidationError("invalid email format!", "email", email);

    isValidPassword(password);

    try {
      // bentuknay array
      const [userRows] = await userRepositories.findByEmail({ email });
      const existingUser = userRows[0]; // Ambil data user index 0

      if (existingUser) {
        throw new DataAlreadyExistsError(
          "Email is already registered.",
          "email",
          email,
        );
      }

      const passwordHash = await hashPassword(password);
      const username = await randomUsername();

      const [QueryResult] = await userRepositories.insertOne({
        email,
        password: passwordHash,
        username,
      });

      return {
        success: true,
        username,
        email,
        insertId: QueryResult.insertId,
      };
    } catch (error) {
      // Menangkap error dari findByEmail, hashPassword, atau insertOne
      LOGGER.error({
        label: "db",
        message: "Unhandled DB Error during user creation:",
        error,
      });
      throw error;
    }
  }

  // * deleteUser
  async deleteUser({ id , password }) {
    // guard
    if (isNullish(id, password)) throw new ValidationError("id and password fields required", "id:password", null, 400);

    try {
     
     const [userRows] = await userRepositories.findById(id);
      const user = userRows[0];
      if (!user) {
        throw new DataNotExistsError("targeted user not found!", "id", id);
      }

      // cek authority
      const isMatch = await comparePassword(password, user.password);

      if (!isMatch) {
        // 401 Unauthorized
        throw new ValidationError(
          "password wrong.",
          "password",
          null,
          401,
        );
      }
     
     
      const [QueryResult] = await userRepositories.deleteOne({ id });

      if (QueryResult.affectedRows === 1) {
        return {
          success: true, // PERBAIKAN (TYPO): succes -> success
          affectedRows: QueryResult.affectedRows, // PERBAIKAN: Menghapus @ts-ignore
        };
      } else {
        throw new DataNotExistsError(
          "targeted user by id to delete not found!",
          "id",
          id,
        );
      }
    } catch (error) {
      LOGGER.error({
        label: "db",
        message: "Unhandled DB Error during user deletion:",
        error,
        id,
      });
      throw error;
    }
  }

  async updatePassword({ id, oldPassword, newPassword }) {
    // Guard
    if (isNullish(id, oldPassword, newPassword)) {
      throw new ValidationError(
        "id, oldPassword, and newPassword fields required",
      );
    }

    isValidPassword(newPassword);

    if (oldPassword === newPassword) {
      throw new ValidationError(
        "New password cannot be the same as the old password.",
        "newPassword",
      );
    }

    try {
      const [userRows] = await userRepositories.findById(id);
      const user = userRows[0];
      if (!user) {
        throw new DataNotExistsError("targeted user not found!", "id", id);
      }

      // cek authority
      const isMatch = await comparePassword(oldPassword, user.password);

      if (!isMatch) {
        // 401 Unauthorized
        throw new ValidationError(
          "Old password does not match.",
          "oldPassword",
          null,
          401,
        );
      }

      const newPasswordHash = await hashPassword(newPassword);

      const [QueryResult] = await userRepositories.updatePassword({
        id,
        newPassword: newPasswordHash,
      });

      if (QueryResult.affectedRows === 1) {
        return {
          success: true,
          affectedRows: QueryResult.affectedRows,
        };
      } else {
        throw new DataNotExistsError(
          "targeted user not found or update failed!",
          "id",
          id,
        );
      }
    } catch (error) {
      LOGGER.error({
        label: "db",
        message: "Unhandled DB Error during password update:",
        error,
        id,
      });
      throw error;
    }
  }

  async authenticateUser({ email, password }) {
    if (isNullish(email, password)) {
      throw new ValidationError("Email and password are required");
    }

    try {
      const [userRows] = await userRepositories.findByEmail({ email });
      const existingUser = userRows[0]; // Ambil data user i 0

      if (!existingUser) {
        throw new ValidationError(
          "Invalid credentials.",
          "email:password",
          null,
          401,
        );
      }

      const isMatch = await comparePassword(password, existingUser.password);

      if (!isMatch) {
        throw new ValidationError(
          "Invalid credentials.",
          "password",
          null,
          401,
        );
      }

      delete existingUser.password; // hapus prop password

      return {
        success: true,
        user: existingUser,
      };
    } catch (error) {
      if (error.name !== "ValidationError") {
        LOGGER.error({
          label: "db",
          message: "Unhandled DB Error during authentication:",
          error,
          email,
        });
      }
      throw error;
    }
  }

  async updateEmail({ id, newEmail, oldEmail, password }) {
    if (isNullish(id, oldEmail, newEmail, password)) {
      throw new ValidationError(
        "id, oldEmail, newEmail, and password are required!",
        "id:newEmail:oldEmail:password",
      );
    }

    if (!isEmail(newEmail)) {
      throw new ValidationError(
        "Invalid new email format!",
        "newEmail",
        newEmail,
      );
    }

    if (oldEmail === newEmail) {
      throw new ValidationError(
        "New email cannot be the same as the old email",
        "newEmail",
      );
    }

    try {
      const [userRows] = await userRepositories.findById(id);
      const user = userRows[0];

      if (!user) {
        throw new DataNotExistsError("User not found.", "id", id);
      }

      if (user.email !== oldEmail) {
        throw new ValidationError(
          "Old email does not match our records.",
          "oldEmail",
          null,
          401,
        );
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new ValidationError(
          "Password does not match.",
          "password",
          null,
          401,
        );
      }

      const [existingEmailRows] = await userRepositories.findByEmail({
        email: newEmail,
      });
      if (existingEmailRows.length > 0) {
        throw new DataAlreadyExistsError(
          "Email has been registered with another user",
          "newEmail",
          newEmail,
          409, // 409 Conflict
        );
      }

      const [QueryResult] = await userRepositories.updateEmail({
        newEmail,
        id,
      });

      if (QueryResult.affectedRows === 1) {
        return {
          success: true,
          affectedRows: QueryResult.affectedRows,
        };
      } else {
        throw new DataNotExistsError(
          "Targeted user not found or update failed!",
          "id",
          id,
        );
      }
    } catch (error) {
      // Hanya log error yang tidak terduga (bukan ValidationError/DataNotExists)
      if (
        error.name !== "ValidationError" &&
        error.name !== "DataNotExistsError" &&
        error.name !== "DataAlreadyExistsError" 
      ) {
        LOGGER.error({
          label: "db",
          message: "Unhandled DB Error during email update:",
          error,
          id,
        });
      }
      // Lempar ulang error agar Controller bisa menangani
      throw error;
    }
  }
}

export default new UserServices();
