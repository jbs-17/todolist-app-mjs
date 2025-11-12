import deleteOne from "../users/delete.one.mjs";
import findByid from "./find.by.id.mjs";
import findTodosByUserId from "./find.todos.by.user.id.mjs";
import insertOne from "./insert.one.mjs";
import updateFullById from "./update.full.by.id.mjs";
import updateOneIsDone from "./update.one.is_done.mjs";
import updateTitleAndDescriptionById from "./update.title.description.by.id.mjs";

const todoListSimpleRepositories = {
  findByid,
  findTodosByUserId,
  deleteOne,
  insertOne,
  updateFullById,
  updateOneIsDone,
  updateTitleAndDescriptionById,
};

export default todoListSimpleRepositories;
