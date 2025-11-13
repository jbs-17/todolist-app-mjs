class DataNotExistsError extends Error {
  constructor(message, field = "general", value = null, statusCode = 409) {
    super(message);
    this.name = "DataNotExistsError";
    this.field = field;
    this.value = value;
    this.statusCode = statusCode;
  }
}

export default DataNotExistsError;
