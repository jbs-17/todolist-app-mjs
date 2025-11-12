import winston from "winston";
const { json, timestamp, prettyPrint } = winston.format;

const format = winston.format.combine(json(), timestamp(), prettyPrint());

const consoleTransport = new winston.transports.Console({
  format: format,
});

const _LOGGER = winston.createLogger({
  transports: [consoleTransport],
  level: "debug",
  handleRejections: true,
  handleExceptions: true,
});

export default _LOGGER;
