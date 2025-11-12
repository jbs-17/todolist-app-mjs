import express from "express";

import LOGGER from "../configs/logger.config.mjs";

export default async function errorHandingMiddleware(
  err,
  req = express.request,
  res = express.response,
) {
  LOGGER.error({ err, message: "Error" });

  res.status(500).json({
    message: "INTERNAL SERVER ERROR",
    code: 500,
    data: [],
  });
}
