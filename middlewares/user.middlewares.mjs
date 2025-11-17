// middlewares/user.middlewares.mjs

import ValidationError from "../errors/validation.error.mjs";
import userServices from "../services/user.services.mjs";
import jwt from "jsonwebtoken";
import CONFIG from "../configs/config.mjs";

import pkg from 'validator';
const { isEmail } = pkg;
import isValidPassword from "../utils/isValidPassword.mjs";
import { validateRequiredFields } from "../utils/validation.helper.mjs";

const userMiddlewares = {
  async verifyRegister(req, res, next) {
    const { email, password } = req.body || {};

    validateRequiredFields({ email, password }); // Akan throw jika salah satu hilang

    if (!isEmail(email)) {
      return next(
        new ValidationError("invalid email format!", "email", email, 400),
      );
    }

    isValidPassword(password); // akan throw error jika invalid

    next();
  },

  async verifyLogin(req, res, next) {
    const { email, password } = req.body || {};

    // Cek keberadaan field
    validateRequiredFields({ email, password });

    // Cek format email
    if (!isEmail(email)) {
      return next(
        new ValidationError("invalid email format!", "email", email, 400),
      );
    }

    // Catatan: Tidak perlu memanggil isValidPassword(password)
    // karena login hanya membandingkan hash, bukan memvalidasi kekuatannya.

    next();
  },

  async verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    // Pastikan formatnya "Bearer [TOKEN]"
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    // 1. Cek token hilang (401)
    if (!token) {
      return next(
        new ValidationError("Access token required.", "token", null, 401),
      );
    }

    try {
      // 2. Verifikasi Token dan Dapatkan ID
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
      // Ambil ID dari payload. Asumsi: payload adalah {id: 1} atau {user_id: 1}
      const id = decoded.id || decoded.user_id;

      if (!id) {
        return next(
          new ValidationError(
            "Invalid token structure: User ID missing.",
            "token",
            null,
            401,
          ),
        );
      }

      // 3. Cari User di Database (Service akan throw 404 jika tidak ditemukan)
      const { user } = await userServices.findById({ id });

      // 4. Lanjut ke Controller
      req.user = user;
      next();
    } catch (error) {
      // Tangkap error JWT spesifik (Expired, Invalid Signature)
      if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
      ) {
        return next(
          new ValidationError("Invalid or expired token.", "token", null, 401),
        );
      }

      // Melempar error lainnya (DataNotExistsError dari service,
      // atau error DB 500 lainnya) ke Global Handler
      next(error);
    }
  },

  async verifyUserDeletion(req, res, next) {
    const { id, password } = req.body || {};

    validateRequiredFields({ id, password });

    isValidPassword(password); // akan throw error jika invalid

    next();
  },

  async verifyPasswordPatch(req, res, next) {
    const { id, oldPassword, newPassword } = req.body || {};

    validateRequiredFields({ id, oldPassword, newPassword });

    isValidPassword(oldPassword);
    isValidPassword(newPassword);

    next();
  },

  async verifyEmailPatch(req, res, next) {
    const { id, newEmail, oldEmail, password } = req.body  || {};

    validateRequiredFields({ id, newEmail, oldEmail, password });

    if (!isEmail(newEmail)) {
      return next(
        new ValidationError(
          "Invalid format for newEmail",
          "newEmail",
          null,
          400,
        ),
      );
    }
    if (!isEmail(oldEmail)) {
      return next(
        new ValidationError(
          "Invalid format for oldEmail",
          "oldEmail",
          null,
          400,
        ),
      );
    }

    isValidPassword(password);

    next();
  },
};

export default userMiddlewares;
