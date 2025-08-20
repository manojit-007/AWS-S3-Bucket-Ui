const {
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { createToken } = require("../middleware/jwtTokenHandler");
const User = require("../models/userModels");
const crypto = require("crypto");
const catchAsyncError = require("../utils/catchAsyncError");
const { encrypt, decrypt } = require("../utils/encryption");
const ResponseHandler = require("../utils/responseHandler");
const { getS3Client } = require("../service/s3Client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const SendEmail = require("../utils/email");

const createUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return ResponseHandler(res, 400, "Email and password are required");
  }
  const verificationToken = crypto.randomBytes(4).toString("hex").slice(0, 8);
  const verificationTokenExpires = Date.now() + 60 * 60 * 1000;
  const newUser = await User.create({
    email,
    password,
    verificationToken,
    verificationTokenExpires,
  });
  const verificationUrl = `Click here to verify your email: ${verificationToken}`;
  await SendEmail({
    email: email,
    subject: "Verify Your Email",
    message: verificationUrl,
    isHtml: true,
  });

  const token = await createToken(newUser);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    sameSite: "strict", //   or "strict" for better security
    maxAge: 7 * 24 * 60 * 60 * 1000, //   7 days
  });
  return ResponseHandler(res, 200, "User logged in successfully", {
    user: newUser.secureObj(),
    token,
  });
});

const resendVerificationCode = catchAsyncError(async (req, res, next) => {
  const email = req.user?.email;

  if (!email) {
    return ResponseHandler(res, 400, "Email is required");
  }

  //   Await the DB query so we get a real user document
  const user = await User.findOne({ email });

  if (!user) {
    return ResponseHandler(res, 404, "User not found");
  }

  if (user.isVerified) {
    return ResponseHandler(res, 400, "User is already verified");
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(4).toString("hex").slice(0, 8);
  const verificationTokenExpires = Date.now() + 60 * 60 * 1000;

  user.verificationToken = verificationToken;
  user.verificationTokenExpires = verificationTokenExpires;

  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${verificationToken}`;

  try {
    await SendEmail({
      email: user.email,
      subject: "Resend Verification Code",
      message: verificationUrl,
      isHtml: true,
    });

    return ResponseHandler(res, 200, "Verification code resent successfully");
  } catch (error) {
    // Rollback token fields if email sending fails
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return ResponseHandler(
      res,
      500,
      "Error sending verification email. Please try again later."
    );
  }
});

const verifyEmail = catchAsyncError(async (req, res, next) => {
  const { verificationToken } = req.body;
  const email = req.user.email;

  if (!verificationToken) {
    return ResponseHandler(res, 400, "Verification token is required");
  }

  const user = await User.findOne({
    email,
    verificationToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return ResponseHandler(res, 400, "Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  const token = await createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ResponseHandler(res, 200, "Email verified successfully", {
    user: user.secureObj(),
    token,
  });
});

const logInUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return ResponseHandler(res, 401, "Invalid email or password");
  }
  const token = await createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    sameSite: "strict", //   or "strict" for better security
    maxAge: 7 * 24 * 60 * 60 * 1000, //   7 days
  });
  return ResponseHandler(res, 200, "User logged in successfully", {
    user: user.secureObj(),
    token,
  });
});

const logOutUser = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    // sameSite: "none",
    sameSite: "strict", //   or "strict" for better security
    maxAge: 7 * 24 * 60 * 60 * 1000, //   7 days
  });
  return ResponseHandler(res, 200, "User logged out successfully");
});

const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    "+resetToken +resetTokenExpiry"
  );

  if (!user) {
    return ResponseHandler(res, 404, "User not found with this email.");
  }

  // Check if token already exists and valid
  if (
    user.resetToken &&
    user.resetTokenExpiry &&
    user.resetTokenExpiry > Date.now()
  ) {
    return ResponseHandler(
      res,
      400,
      "A password reset request already exists. Please wait for it to expire."
    );
  }

  // Generate new token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    await SendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
      isHtml: true,
    });

    return ResponseHandler(res, 200, "Password reset email sent successfully.");
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return ResponseHandler(
      res,
      500,
      "Error sending email. Please try again later."
    );
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return ResponseHandler(
      res,
      400,
      "Reset token and new password are required."
    );
  }

  // Hash raw token received from frontend
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find user with hashed token & valid expiry
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return ResponseHandler(
      res,
      400,
      "Invalid or expired password reset token."
    );
  }

  // Update password
  user.password = newPassword;

  // Clear token fields
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  return ResponseHandler(
    res,
    200,
    "Password reset successful. You can now log in."
  );
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return ResponseHandler(res, 404, "User not found");
  }

  // Clear auth cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ✅ Security email content
  const message = `
    <p>Hello ${user?.email || "User"},</p>
    <p>Your account has been <strong>deleted from our system</strong>.</p>
    <p>For security purposes, please log in to your AWS account and <strong>remove, deactivate, or delete</strong> any API keys you may have created and linked with our service to prevent unauthorized access.</p>
    <br/>
    <p>If you did not request this action, please contact our support team immediately.</p>
    <br/>
    <p>Thank you,<br/>The Security Team</p>
  `;

  try {
    await SendEmail({
      email: user.email,
      subject: "Important: Your Account & AWS Keys",
      message,
      isHtml: true,
    });
  } catch (error) {
    console.error("Failed to send account deletion email:", error);
  }

  return ResponseHandler(res, 200, "User deleted successfully", {
    user: user.secureObj(),
  });
});

const getUserDetails = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return ResponseHandler(res, 404, "User not found");
  }
  const token = await createToken(user);
  const userDetails = user.secureObj();
  delete userDetails.password;
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    sameSite: "strict", //   or "strict" for better security
    maxAge: 7 * 24 * 60 * 60 * 1000, //   7 days
  });
  return ResponseHandler(res, 200, "User details retrieved successfully", {
    user: userDetails,
    token,
  });
});

const storeS3ApiKey = catchAsyncError(async (req, res, next) => {
  const { awsAccessKey, awsSecretKey, awsRegion, bucketName } = req.body;
  if (!awsAccessKey || !awsSecretKey || !awsRegion || !bucketName) {
    return ResponseHandler(res, 400, "All fields are required");
  }
  let newAwsAccessKey = encrypt(awsAccessKey);
  let newAwsSecretKey = encrypt(awsSecretKey);
  const userId = req.user.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        awsAccessKey: newAwsAccessKey,
        awsSecretKey: newAwsSecretKey,
        awsRegion,
        bucketName,
        hasCredentials: true,
      },
      { new: true, runValidators: true }
    );
    if (!user) {
      return ResponseHandler(res, 404, "User not found");
    }
    return ResponseHandler(res, 200, "S3 API keys stored successfully", {
      user: user.secureObj(),
    });
  } catch (error) {
    return ResponseHandler(res, 500, "Error storing S3 API keys", {
      error: error.message,
    });
  }
});

const removeApiKey = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      awsAccessKey: null,
      awsSecretKey: null,
      awsRegion: null,
      bucketName: null,
      hasCredentials: false,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return ResponseHandler(res, 404, "User not found");
  }

  // ✅ Updated email content
  const message = `
    <p>Hello ${user?.email || "User"},</p>
    <p>Your AWS API keys have been <strong>deleted from our system</strong>.</p>
    <p>For security purposes, please log in to your AWS account and <strong>remove, deactivate, or delete</strong> those keys to prevent any unauthorized access.</p>
    <br/>
    <p>If you did not request this change, please contact our support team immediately.</p>
    <br/>
    <p>Thank you,<br/>The Security Team</p>
  `;

  try {
    await SendEmail({
      email: user.email,
      subject: "Important: Your AWS Keys Have Been Deleted",
      message,
      isHtml: true,
    });

    return ResponseHandler(res, 200, "S3 API keys removed successfully", {
      user: user.secureObj(),
    });
  } catch (error) {
    return next(error);
  }
});

const listContent = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select(
    "+awsAccessKey +awsSecretKey +awsRegion +bucketName"
  );
  if (!user) {
    return ResponseHandler(res, 404, "User not found");
  }
  const client = new S3Client({
    credentials: {
      accessKeyId: decrypt(user.awsAccessKey),
      secretAccessKey: decrypt(user.awsSecretKey),
    },
    region: user.awsRegion,
  });
  try {
    const command = new ListObjectsV2Command({
      Bucket: user.bucketName,
    });
    const result = await client.send(command);
    return ResponseHandler(res, 200, "Content listed successfully", {
      content: result.Contents || [],
    });
  } catch (error) {
    return ResponseHandler(res, 500, "Error listing content", {
      error: error.message,
    });
  }
});

const urlToUpload = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { files } = req.body; // expecting [{ fileName, contentType }, ...]

  if (!Array.isArray(files) || files.length === 0) {
    return ResponseHandler(
      res,
      400,
      "files[] with fileName and contentType is required"
    );
  }

  let user = await User.findById(userId).select(
    "+awsAccessKey +awsSecretKey +awsRegion +bucketName"
  );

  if (!user) {
    return ResponseHandler(res, 404, "User not found");
  }

  const client = new S3Client({
    credentials: {
      accessKeyId: decrypt(user.awsAccessKey),
      secretAccessKey: decrypt(user.awsSecretKey),
    },
    region: user.awsRegion,
  });

  const signedUrls = [];

  for (const file of files) {
    const command = new PutObjectCommand({
      Bucket: user.bucketName,
      Key: file.fileName,
      ContentType: file.contentType || "application/octet-stream",
    });

    const url = await getSignedUrl(client, command, {
      expiresIn: 600, // 10 minutes
    });

    signedUrls.push({
      fileName: file.fileName,
      url,
    });
  }

  user = user.secureObj();
  return ResponseHandler(res, 200, "URLs generated successfully", {
    signedUrls,
  });
});

const deleteS3Object = catchAsyncError(async (req, res) => {
  const userId = req.user.id;
  const { key } = req.body;

  if (!key) return ResponseHandler(res, 400, "S3 object key is required");

  const user = await User.findById(userId).select(
    "+awsAccessKey +awsSecretKey +awsRegion +bucketName"
  );

  if (!user) return ResponseHandler(res, 404, "User not found");

  const client = new S3Client({
    region: user.awsRegion,
    credentials: {
      accessKeyId: decrypt(user.awsAccessKey),
      secretAccessKey: decrypt(user.awsSecretKey),
    },
  });

  await client.send(
    new DeleteObjectCommand({
      Bucket: user.bucketName,
      Key: key,
    })
  );

  return ResponseHandler(res, 200, "File deleted successfully");
});

const deleteAllPrefix = catchAsyncError(async (req, res) => {
  const userId = req.user.id;
  let { prefix } = req.body; // e.g., "sample/test"
  if (!prefix) return ResponseHandler(res, 400, "Prefix is required");
  if (!prefix.endsWith("/")) prefix += "/";

  const user = await User.findById(userId).select(
    "+awsAccessKey +awsSecretKey +awsRegion +bucketName"
  );
  if (!user) return ResponseHandler(res, 404, "User not found");

  const client = new S3Client({
    region: user.awsRegion,
    credentials: {
      accessKeyId: decrypt(user.awsAccessKey),
      secretAccessKey: decrypt(user.awsSecretKey),
    },
  });

  try {
    const Bucket = user.bucketName;
    let isTruncated = true;
    let ContinuationToken;
    let totalDeleted = 0;

    while (isTruncated) {
      const listResponse = await client.send(
        new ListObjectsV2Command({
          Bucket,
          Prefix: prefix,
          ContinuationToken,
        })
      );

      if (!listResponse.Contents || listResponse.Contents.length === 0) break;

      const objectsToDelete = listResponse.Contents.map((item) => ({
        Key: item.Key,
      }));

      await client.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: objectsToDelete },
        })
      );

      totalDeleted += objectsToDelete.length;
      isTruncated = listResponse.IsTruncated;
      ContinuationToken = listResponse.NextContinuationToken;
    }

    return ResponseHandler(
      res,
      200,
      `${totalDeleted} items deleted successfully`
    );
  } catch (err) {
    console.error("   Error deleting folder prefix:", err);
    return ResponseHandler(res, 500, "Failed to delete folder contents");
  }
});

const downloadS3FileSignedUrl = async (req, res) => {
  try {
    // const { key } = req.query;
    // const {key} = req.query;
    const key = decodeURIComponent(req.query.key);
    if (!key) return ResponseHandler(res, 400, "S3 object key is required");

    const user = await User.findById(req.user.id).select(
      "+awsAccessKey +awsSecretKey +awsRegion +bucketName"
    );
    if (!user) return ResponseHandler(res, 404, "User not found");

    const client = new S3Client({
      region: user.awsRegion,
      credentials: {
        accessKeyId: decrypt(user.awsAccessKey),
        secretAccessKey: decrypt(user.awsSecretKey),
      },
    });

    const command = new GetObjectCommand({
      Bucket: user.bucketName,
      Key: key,
    });
    user.secureObj();

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return ResponseHandler(res, 200, "Signed URL generated successfully", {
      url,
    });
  } catch (error) {
    console.error("   Error generating signed URL:", error);
    res.status(500).json({ message: "Failed to generate download URL" });
  }
};

//export all controllers
module.exports = {
  createUser,
  logInUser,
  logOutUser,
  deleteUser,
  resendVerificationCode,
  verifyEmail,
  forgetPassword,
  resetPassword,
  getUserDetails,
  storeS3ApiKey,
  removeApiKey,
  listContent,
  urlToUpload,
  deleteS3Object,
  deleteAllPrefix,
  downloadS3FileSignedUrl,
};
