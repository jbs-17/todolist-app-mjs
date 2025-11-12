class ValidationError extends Error {
  constructor(message, field = "general", value = null, statusCode = 400) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
    this.statusCode = statusCode;
  }
}

export default ValidationError;
