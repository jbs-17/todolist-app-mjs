//import CONFIG from './config/config.mjs';
import express from "express";
import errorHandler from "./middlewares/error.handler.mjs";

const app = express();

// * 404 - HANDlER

// * 500 - HANDLER
app.use((err, req, res, next) => errorHandler(err, req, res, next));

export default app;
