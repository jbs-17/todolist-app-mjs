// services/todolist_simple.services.mjs

import EventEmitter from "events";

import pkg from 'validator';
const { isLength } = pkg;
import todoListSimpleRepositories from "../repositories/todolist_simple/index.mjs";
import ValidationError from "../errors/validation.error.mjs";
import isNullish from "../utils/isNullish.mjs";
import LOGGER from "../configs/logger.config.mjs";
import DataNotExistsError from "../errors/data.not.exists.error.mjs";

class TodoListSimpleServices extends EventEmitter {
  async insertOne({
    user_id,
    title,
    description,
    is_done,
    start_time,
    end_time,
  }) {
    if (isNullish(user_id, title)) {
      throw new ValidationError("user_id and title required!");
    }

    if (!isLength(title, { min: 5 })) {
      throw new ValidationError(
        "min title length is 5 char",
        "title",
        title,
        400,
      );
    }

    try {
      // TIDAK PERLU CEK FIND BY ID karena user_id berasal dari token/sesi
      const [QueryResult] = await todoListSimpleRepositories.insertOne({
        user_id,
        title,
        description,
        is_done,
        start_time,
        end_time,
      });

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

  async deleteOne({ user_id, id }) {
    if (isNullish(user_id, id)) {
      throw new ValidationError(
        "user_id and id required!",
        "user_id:id",
        null,
        400,
      );
    }

    try {
      const [QueryResult] = await todoListSimpleRepositories.deleteOne({
        user_id,
        id,
      });

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

  async deleteMany({ user_id, ids }) {
    // --- VALIDASI DI LUAR TRY ---

    if (isNullish(user_id, ids)) {
      throw new ValidationError(
        "user_id and ids required!",
        "user_is:ids",
        null,
        400,
      );
    }
    if (!Array.isArray(ids)) {
      throw new ValidationError("ids must be an array!", "ids", ids, 400);
    }
    if (ids.length < 1) {
      throw new ValidationError("ids array cannot be empty!", "ids", ids, 400);
    }
    // --- AKHIR VALIDASI ---

    try {
      const [QueryResult] = await todoListSimpleRepositories.deleteMany({
        user_id,
        ids,
      });

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

  async updateDone({ user_id, id }) {
    if (isNullish(user_id, id)) {
      throw new ValidationError(
        "user_id and id required!",
        "user_id:id",
        null,
        400,
      );
    }

    try {
      const [QueryResult] = await todoListSimpleRepositories.updateOneIsDone({
        user_id,
        id,
      });

      if (QueryResult.affectedRows === 1) {
        return {
          success: true,
          affectedRows: QueryResult.affectedRows,
        };
      } else {
        throw new DataNotExistsError(
          "targeted todolist_simple failed to update or not found!",
          "id",
          id,
          400,
        );
      }
    } catch (error) {
      LOGGER.error({
        label: "db",
        message: "Unhandled DB Error during todolist_simple update:",
        error,
        id,
      });
      throw error;
    }
  }

  async updateFullById({
    user_id,
    id,
    title,
    description = "",
    start_time = null,
    end_time = null,
    is_done = 0,
  }) {
    if (isNullish(user_id, id, title)) {
      throw new ValidationError(
        "user_is, id, and title required!",
        "user_id:id:title",
        null,
        400,
      );
    }

    if (is_done !== 1 && is_done !== 0) {
      throw new ValidationError(
        "is_done value must be between 0 and 1",
        "is_done",
        is_done,
        400,
      );
    }

    try {
      const [QueryResult] = await todoListSimpleRepositories.updateFullById({
        user_id,
        id,
        title,
        description,
        start_time,
        end_time,
        is_done,
      });

      if (QueryResult.affectedRows === 1) {
        return {
          success: true,
          affectedRows: QueryResult.affectedRows,
        };
      } else {
        throw new DataNotExistsError(
          "targeted todolist_simple failed to update or not found!",
          "id",
          id,
        );
      }
    } catch (error) {
      LOGGER.error({
        label: "db",
        message: "Unhandled DB Error during todolist_simple update:",
        error,
        id,
      });
      throw error;
    }
  }

  async findById({ user_id, id }) {
    if (isNullish(user_id, id)) {
      throw new ValidationError(
        "user_id and id required!",
        "user_id:id",
        null,
        400,
      );
    }

    try {
      const [QueryResult] = await todoListSimpleRepositories.findById({
        user_id,
        id,
      });
      const todo = QueryResult[0];
      if (todo) {
        return { success: true, todo };
      } else {
        throw new DataNotExistsError(
          "targeted todolist_simple with id not found!",
          "id",
          id,
          404,
        );
      }
    } catch (error) {
      LOGGER.error({
        label: "db",
        message: "Unhandled DB error during select one from todolist_simple:",
        error,
        id,
      });
      throw error;
    }
  }

  async findAllByUserId({ user_id }) {
    if (isNullish(user_id)) {
      throw new ValidationError("user_id required!", "user_id", user_id);
    }

    try {
      const [todos] = await todoListSimpleRepositories.findTodosByUserId({
        user_id,
      });

      return {
        success: true,
        todos,
      };
    } catch (error) {
      LOGGER.error({
        label: "db",
        message: "Unhandled DB error during select many from todolist_simple:",
        error,
        user_id,
      });
      throw error;
    }
  }
}

export default new TodoListSimpleServices();
