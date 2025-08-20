import ResponseHandler from "./responseHandler";

// handle error 
const ErrorHandler = (err, req, res, next) => {
    // console.error(err.stack); // Log the error stack trace for debugging
    
    // Check if the error has a status code, otherwise default to 500
    const statusCode = err.statusCode || 500;
    
    // Use ResponseHandler to send the error response
    return ResponseHandler(res, statusCode, err.message || "Internal Server Error");
};

export default ErrorHandler;