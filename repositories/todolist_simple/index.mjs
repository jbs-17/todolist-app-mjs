// repositories/todolist_simple/index.mjs

import deleteOne from "./delete.one.mjs";
import deleteMany from "./delete.many.mjs";
import findById from "./find.by.id.mjs";
import findTodosByUserId from "./find.todos.by.user.id.mjs";
import insertOne from "./insert.one.mjs";
import updateFullById from "./update.full.by.id.mjs";
import updateOneIsDone from "./update.one.is_done.by.id.mjs";
import updateTitleAndDescriptionById from "./update.title.description.by.id.mjs";

const todoListSimpleRepositories = {
  findById,
  findTodosByUserId,
  deleteOne,
  deleteMany,
  insertOne,
  updateFullById,
  updateOneIsDone,
  updateTitleAndDescriptionById,
};

export default todoListSimpleRepositories;
