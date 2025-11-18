// middlewares/error.handler.mjs

import LOGGER from "../configs/logger.config.mjs";
// Import semua custom error yang Anda lempar
import ValidationError from "../errors/validation.error.mjs";
import DataNotExistsError from "../errors/data.not.exists.error.mjs";
import DataAlreadyExistsError from "../errors/data.already.exists.error.mjs";
// ... import custom error lain jika ada

const errorHandler = (err, req, res, next) => {
  // 1. Definisikan respons default untuk error yang tidak terduga
  let statusCode = err.statusCode || 500; // 500 Internal Server Error
  let status = "error";
  let message = err.message ?? "Internal Server Error";
  let fields = null;

  // 2. Log error yang tidak terduga (hanya 500)
    LOGGER.error({
      label: "global-handler",
      message: err.message ?? "Unhandled 500 Error:",
      error: err,
    });

  // 3. Tangani Custom Errors
  if (err instanceof ValidationError || err instanceof DataAlreadyExistsError) {
    // ValidationError seringnya 400 atau 409 (Conflict)
    statusCode = err.statusCode || 400;
    status = "fail";
    message = err.message;
    fields = err.field;
  } else if (err instanceof DataNotExistsError) {
    // DataNotExistsError seringnya 404 (Not Found)
    statusCode = 404;
    status = "fail";
    message = err.message;
  }

  // 4. Kirim Respons JSON
  return res.status(statusCode).json({
    status,
    message,
    fields,
  });
};

export default errorHandler;
