
import pkg from 'validator';
const { isLength } = pkg;
import { validateRequiredFields } from "../utils/validation.helper.mjs";
import ValidationError from "../errors/validation.error.mjs";

const todoListSimpleMiddlewares = {
  async validateCreateOne(req, res, next) {
    const { title } = req.body;

    validateRequiredFields({ title }); // PERBAIKAN
    if (!isLength(title, { min: 5, max: 255 })) {
      return next(
        new ValidationError(
          "title min. length is 5 and max. 255",
          "title",
          title,
          411,
        ),
      );
    }
    next();
  },

  async validateTodoListSimpleId(req, res, next) {
    validateRequiredFields({ id: req.body.id });
    next();
  },

  async validateDeleteMany(req, res, next) {
    validateRequiredFields({ ids: req.body.ids });
    next();
  },

  async validateUpdateFull(req, res, next) {
    // yang wajib hanya id dan title
    const { id, title } = req.body;
    validateRequiredFields({ id, title });
    next();
  },

  async validateIdFromParams(req, res, next) {
    // Ambil id dari parameter URL
    const { id } = req.params;

    // Gunakan validateRequiredFields untuk memeriksa id
    validateRequiredFields({ id });

    next();
  },
};

export default todoListSimpleMiddlewares;
