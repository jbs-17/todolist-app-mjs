class UpdateDataError extends Error {
  constructor(message, field = "general", value = null, statusCode = 500 ) {
    super(message);
    this.name = "UpdateDataError";
    this.field = field;
    this.value = value;
    this.statusCode = statusCode;
  }
}

export default UpdateDataError;
