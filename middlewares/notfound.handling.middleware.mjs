import express from "express";
import LOGGER from "../configs/logger.config.mjs";

export default async function notFoundHandingMiddleware(
  err,
  req = express.request,
  res = express.response,
  next,
) {
  LOGGER.warn({
    message: "404 - NOT FOUND",
    method: req.method,
    path: req.path,
  });

  res.statusCode = 404;
  return res.json({
    code: 404,
    message: "404 - NOT FOUND!",
    data: [],
  });
}
