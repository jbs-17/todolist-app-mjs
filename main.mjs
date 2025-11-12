// @ts-nocheck
import process from "node:process";
import cluster from "node:cluster";

import app from "./app.mjs";
import CONFIG from "./configs/config.mjs";
import LOGGER from "./configs/logger.config.mjs";

if (cluster.isMaster) {
  LOGGER.info({ message: `master : ${process.pid}` });

  for (let i = 0; i < CONFIG.NUMBER_OF_WORKERS; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    LOGGER.error({
      message: `Worker died: ${worker.process.pid}`,
      code,
      worker,
      signal,
    });
  });
} else {
  app.listen(CONFIG.APP_PORT);
}
