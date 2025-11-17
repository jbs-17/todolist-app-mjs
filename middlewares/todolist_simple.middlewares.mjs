import { validateRequiredFields } from "../utils/validation.helper.mjs";

const todoListSimpleMiddlewares = {
    async validateCreateOne(req, res, next) {
        const { id } = req.user;
        const { title } = req.body;

        validateRequiredFields({ id, title });
        next();

    },

    async validateTodoListSimpleId(req, res, next) {

        validateRequiredFields({ id: res.body.id });
        next();

    },

    async validateDeleteMany(req, res, next) {
        validateRequiredFields({ ids: res.body.ids });
        next();
    },

    async validateUpdateFull(req, res, next) {
        // yang wajib hanya id dan title
        const { id, title } = req.body;
        validateRequiredFields({ id, title });
        next();
    }
}

export default todoListSimpleMiddlewares;