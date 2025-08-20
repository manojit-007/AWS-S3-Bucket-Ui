const ResponseHandler = require("./responseHandler");

const globalErrorHandler = (err, req, res, next) => {
  // console.error("   Global Error:", err.message);

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return ResponseHandler(res, 400, {
      message: `User exists with this ${field} value ${value}. Please use a different value.`,
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message).join(", ");
    return ResponseHandler(res, 400, {
      message: `Validation Error: ${errors}`,
    });
  }

  // Mongoose Cast Error
  if (err.name === "CastError") {
    return ResponseHandler(res, 400, {
      message: `Invalid ${err.path}: ${err.value}.`,
    });
  }

  // MongoDB Network Error or Timeout
  if (err.name === "MongoNetworkError" || err.code === "ETIMEDOUT") {
    return ResponseHandler(res, 503, {
      message: "Database connection error. Please try again later.",
    });
  }

  // MongoDB Document Not Found Error
  if (err.name === "DocumentNotFoundError") {
    return ResponseHandler(res, 404, {
      message: "No document found with the specified criteria.",
    });
  }

  // MongoDB Server Error (General)
  if (err.name === "MongoServerError") {
    return ResponseHandler(res, 500, {
      message: `MongoDB Server Error: ${err.message}`,
    });
  }

  // Syntax Error in JSON Payload
  if (err instanceof SyntaxError) {
    return ResponseHandler(res, 400, {
      message: "Invalid JSON payload.",
    });
  }

  // Default Error Handling
  return ResponseHandler(res, err.status || 500, {
    message: err.message || "Internal Server Error",
  });
};

module.exports = globalErrorHandler;
