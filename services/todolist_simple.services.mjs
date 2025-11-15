import EventEmitter from "events";
import { isLength } from 'validator';
import todoListSimpleRepositories from "../repositories/todolist_simple/index.mjs";
import ValidationError from "../errors/validation.error.mjs";
import isNullish from "../utils/isNullish.mjs";
import LOGGER from "../configs/logger.config.mjs";
import DataNotExistsError from "../errors/data.not.exists.error.mjs";
todoListSimpleRepositories.deleteOne

class TodoListSimpleServices extends EventEmitter {
    async insertOne({ user_id, title, description }) {
        if (isNullish(user_id, title)) {
            throw new ValidationError("user_id and title required!");
        }

        if (!isLength(title, { min: 5 })) {
            throw new ValidationError("min title length is 5 char", 'title', title, 400);
        }

        try {
            // TIDAK PERLU CEK FIND BY ID karena user_id berasal dari token/sesi
            const [QueryResult] = await todoListSimpleRepositories.insertOne({ user_id, title, description });

            return {
                success: true,
                insertId: QueryResult.insertId,
            };
        } catch (error) {
            LOGGER.error({
                label: "db",
                message: "Unhandled DB Error during insert one todolist_simple:",
                error,
            });
            throw error;
        }
    }

    async deleteOne({ id }) {
        try {
            if (isNullish(id)) {
                throw new ValidationError("id required!", 'id', id, 400);
            }

            const [QueryResult] = await todoListSimpleRepositories.deleteOne({ id });

            if (QueryResult.affectedRows === 1) {
                return {
                    success: true,
                    affectedRows: QueryResult.affectedRows,
                };
            } else {
                throw new DataNotExistsError(
                    "targeted todolist_simple by id to delete failed or not found!",
                    "id",
                    id,
                );
            }
        } catch (error) {
            LOGGER.error({
                label: "db",
                message: "Unhandled DB Error during todolist_simple deletion:",
                error,
                id,
            });
            throw error;
        }
    }

    async deleteMany({ ids }) {
        try {
            if (isNullish(ids)) {
                throw new ValidationError("ids required!", 'ids', ids, 400);
            }

            if (!Array.isArray(ids)) {
                throw new ValidationError("ids must be an array!", 'ids', ids, 400);
            }

            if (ids.length < 1) {
                throw new ValidationError("ids array cannot be empty!", 'ids', ids, 400);
            }

            const [QueryResult] = await todoListSimpleRepositories.deleteMany({ ids });

            if (QueryResult.affectedRows === ids.length) {
                return {
                    success: true,
                    affectedRows: QueryResult.affectedRows,
                };
            } else {
                // Ini menunjukkan penghapusan parsial (partial success) atau tidak ada yang terhapus
                throw new DataNotExistsError(
                    "all or some targeted todolist_simple by id to delete failed or not found!",
                    "ids",
                    ids,
                );
            }
        } catch (error) {
            LOGGER.error({
                label: "db",
                message: "Unhandled DB Error during todolist_simple deletions:",
                error,
                ids,
            });
            throw error;
        }
    }

    async updateDone({ todolist_simple_id }) {
        if(isNullish(todoListSimpleRepositories)){
            throw new ValidationError("todolist_simple_id required!", "todolist_simple_id", todolist_simple_id, 400);
        }

        try {
            const exist = await todoListSimpleRepositories.findByid({id})
        } catch (error) {
            
        }
        todoListSimpleRepositories.updateOneIsDone({ todolist_simple_id })
    }


}

export default new TodoListSimpleServices();