import userControllers from "../controllers/user.controllers.mjs";
import express from "express";
import userMiddlewares from "../middlewares/user.middlewares.mjs";
import { JSONBodyPreprocessorMiddleware } from "../middlewares/body.json.preprocessor.middlweware.mjs";

const prefix = "/api/v1/user";
const router = express.Router({
  strict: true,
  caseSensitive: true,
});

router.use(JSONBodyPreprocessorMiddleware);

router.post(
  "/register",
  userMiddlewares.verifyRegister,
  userControllers.newUser,
);
router.post(
  "/login",
  userMiddlewares.verifyLogin,
  userControllers.authenticateUser,
); // verifyRegister sama saja dengan login
router.get("/get-data", userMiddlewares.verifyToken, userControllers.getData);
router.delete(
  "/delete",
  userMiddlewares.verifyUserDeletion,
  userControllers.deleteUser,
);
router.patch(
  "/password",
  userMiddlewares.verifyPasswordPatch,
  userControllers.updatePassword,
);
router.patch(
  "/email",
  userMiddlewares.verifyEmailPatch,
  userControllers.updateEmail,
);

export function userRoutes(app) {
  app.use(prefix, router);
}
