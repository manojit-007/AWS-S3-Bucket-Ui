const invalidJsonHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      console.error("   Invalid JSON:", err.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format. Please check your request body.",
        path: req.path
      });
    }
    next(err); // Pass control to the next middleware if not a JSON error
  };
  
  module.exports = invalidJsonHandler;
  