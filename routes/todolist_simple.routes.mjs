// routes/todolist_simple.routes.mjs

import express from "express";
import userMiddlewares from "../middlewares/user.middlewares.mjs";
import todoListSImpleMiddlewares from "../middlewares/todolist_simple.middlewares.mjs";
import todoListSimpleControllers from "../controllers/todolist_simple.controllers.mjs";

const prefix = "/api/v1/todolist_simple";
const router = express.Router({
  strict: true,
  caseSensitive: true,
});

router.use(userMiddlewares.verifyToken); // pastikan semua ada req.user

router.post(
  "/create-one",
  todoListSImpleMiddlewares.validateCreateOne,
  todoListSimpleControllers.createOne,
);

router.delete(
  "/delete-one",
  todoListSImpleMiddlewares.validateTodoListSimpleId,
  todoListSimpleControllers.deleteOne,
);

router.delete(
  "/delete-many",
  todoListSImpleMiddlewares.validateDeleteMany,
  todoListSimpleControllers.deleteMany,
);

router.get("/", todoListSimpleControllers.getAll); // GET (bukan POST)

router.get(
  "/:id",
  todoListSImpleMiddlewares.validateIdFromParams,
  todoListSimpleControllers.getOne,
); // GET dengan parameter URL

router.patch(
  "/done",
  todoListSImpleMiddlewares.validateTodoListSimpleId,
  todoListSimpleControllers.updateDone,
);

router.put(
  "/update-full",
  todoListSImpleMiddlewares.validateUpdateFull,
  todoListSimpleControllers.updateFull,
);

export function todoListSimpleRoutes(app) {
  // PERBAIKAN
  app.use(prefix, router);
}
