class DataAlreadyExistsError extends Error {
  constructor(message, field = "general", value = null, statusCode = 409) {
    super(message);
    this.name = "DataAlreadyExistsError";
    this.field = field;
    this.value = value;
    this.statusCode = statusCode;
  }
}

export default DataAlreadyExistsError;
