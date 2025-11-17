import express from "express";
import errorHandler from "./middlewares/error.handler.mjs";
import { userRoutes } from "./routes/user.routes.mjs";
import { todoListSimpleRoutes } from "./routes/todolist_simple.routes.mjs";

const app = express();
app.use(express.json());
userRoutes(app);
todoListSimpleRoutes(app);

// * 404 - HANDlER

// * 500 - HANDLER
app.use((err, req, res, next) => errorHandler(err, req, res, next));

export default app;
