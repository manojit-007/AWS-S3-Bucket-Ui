const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createUser, // --  Controller: create a new user
  logInUser, // --  Controller: log in a user
  getUserDetails, // --  Controller: fetch details of logged-in user
  storeS3ApiKey, // --  Controller: save AWS S3 API key for the user
  listContent, // --  Controller: list contents of user's S3 bucket
  urlToUpload, // --  Controller: generate pre-signed URL for upload
  deleteS3Object, // --  Controller: delete a single object from S3
  deleteAllPrefix, // --  Controller: delete all objects with a specific prefix
  downloadS3FileSignedUrl, // --  Controller: generate pre-signed URL for download
  deleteUser, // --  Controller: delete the user account
  removeApiKey, // --  Controller: remove stored AWS API key
  forgetPassword, // --  Controller: initiate password reset process
  logOutUser, // --  Controller: log out the user
  resendVerificationCode, // --  Controller: resend email verification code
  verifyEmail, // --  Controller: verify email with provided code
  resetPassword, // --  Controller: reset password after verification
} = require("../controllers/userControllers");

const { validateJsonWebToken } = require("../middleware/jwtTokenHandler");
const ResponseHandler = require("../utils/responseHandler");

const UserRouter = express.Router();

/* ------------------- Rate Limiters ------------------- */
// 🚫 Limit brute-force on auth endpoints

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  handler: (req, res) => {
    ResponseHandler(
      res,
      429,
      "Too many login/signup attempts. Please try later."
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 📂 Limit S3-heavy endpoints

const s3Limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  handler: (req, res) => {
    ResponseHandler(res, 429, "⏳ Too many S3 operations, slow down.");
  },
  standardHeaders: true,
  legacyHeaders: false,
});
/* --------------------------------------------------------- 
  Public Routes
 ---------------------------------------------------------- */

// 🆕 Create a new user account (signup) - rate-limited to prevent abuse
UserRouter.post("/signUp", authLimiter, createUser);

// 🔑 Authenticate existing user (login) - rate-limited to prevent brute force
UserRouter.post("/logIn", authLimiter, logInUser);

// 🔓 Request password reset (forgot password flow) - rate-limited
UserRouter.post("/forgetPassword", authLimiter, forgetPassword);

// 🔑 Reset password using token/code - rate-limited
UserRouter.post("/reset-password", authLimiter, resetPassword);

/* ---------------------------------------------------------- 
Authenticated Routes 
---------------------------------------------------------- */

//   Apply JWT middleware globally below this line
UserRouter.use(validateJsonWebToken);

// 🚪 Log out the current user session
UserRouter.post("/logOut", logOutUser);

// 📩 Resend email verification code (if user didn’t receive it)
UserRouter.post("/getVerificationCode", resendVerificationCode);

//   Verify user email with provided code
UserRouter.post("/verifyEmail", verifyEmail);

//    Delete user account permanently
UserRouter.post("/deleteUser", deleteUser);

// 👤 Get details of the currently logged-in user
UserRouter.get("/getDetails", getUserDetails);

// 💾 Save AWS S3 API keys securely for the user
UserRouter.post("/saveAwsApiKey", storeS3ApiKey);

// 🗑️ Remove stored AWS S3 API keys
UserRouter.post("/removeAwsApiKey", removeApiKey);

/* ----------------------------------------------------------
 S3 Routes (Extra Limiter Applied) 
---------------------------------------------------------- */

// 📂 List contents of user’s S3 bucket
UserRouter.get("/getS3BucketContent", s3Limiter, listContent);

// 📤 Generate pre-signed URL for file upload
UserRouter.post("/getUrlToUpload", s3Limiter, urlToUpload);

// 🗑️ Delete a single object from S3
UserRouter.delete("/delete", s3Limiter, deleteS3Object);

// 🗑️ Delete all objects within a folder/prefix in S3
UserRouter.delete("/deleteAllPrefix", s3Limiter, deleteAllPrefix);

// 📥 Generate pre-signed URL to download a file from S3
UserRouter.get("/download", s3Limiter, downloadS3FileSignedUrl);

// Export the router for use in the main app
module.exports = UserRouter;
