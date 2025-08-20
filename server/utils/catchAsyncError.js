// Middleware to catch and handle async errors
module.exports = (anyFunction) => (req, res, next) => {
    Promise.resolve(anyFunction(req, res, next)).catch(next);
  };
  