//import CONFIG from './config/config.mjs';
import express from "express";
import errorHandingMiddleware from "./middlewares/error.handling.middleware.mjs";
import notFoundHandingMiddleware from "./middlewares/notfound.handling.middleware.mjs";

const app = express();


// * 404 - HANDlER
app.use((err, req, res, next) => notFoundHandingMiddleware(err, req, res, next));

// * 500 - HANDLER
app.use((err, req, res, next) => errorHandingMiddleware(err, req, res, next));

export default app;
