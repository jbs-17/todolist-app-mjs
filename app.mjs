//import CONFIG from './config/config.mjs';
import express from "express";
import errorHandingMiddleware from "./middlewares/error.handling.middleware.mjs";
import notFoundHandingMiddleware from "./middlewares/notfound.handling.middleware.mjs";

const app = express();

// * 404 - HANDlER
// @ts-ignore
app.use(notFoundHandingMiddleware);

// * 500 - HANDLER
app.use(errorHandingMiddleware);

export default app;
