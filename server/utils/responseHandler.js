const ResponseHandler = (res, statusCode,message, data = {}) => {
    res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300, 
      message,
      data,
    });
  };
  
  module.exports = ResponseHandler;
  // const ResponseHandler = (res, statusCode, message, data = {}) => {
  //   // Ensure message is always a string
  //   let msgString = "";
  
  //   if (!message) {
  //     msgString = "";
  //   } else if (typeof message === "string") {
  //     msgString = message;
  //   } else if (typeof message === "object" && message.message) {
  //     msgString = message.message;
  //   } else {
  //     // fallback if unknown format
  //     msgString = JSON.stringify(message);
  //   }
  
  //   res.status(statusCode).json({
  //     success: statusCode >= 200 && statusCode < 300,
  //     message: msgString,
  //     data,
  //   });
  // };
  
  // module.exports = ResponseHandler;
  