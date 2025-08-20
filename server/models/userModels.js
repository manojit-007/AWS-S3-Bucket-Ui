const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    hasCredentials: { type: Boolean, default: false },
    awsAccessKey: { type: String, select: false },
    awsSecretKey: { type: String, select: false },
    awsRegion: { type: String, select: false },
    bucketName: { type: String, select: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 📧 Create password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(64).toString("hex");

  this.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 mins expiry

  return resetToken; 
};


// 🧼 Optional: Remove sensitive fields globally from responses
UserSchema.methods.secureObj = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.awsAccessKey;
  delete obj.awsSecretKey;
  delete obj.awsRegion;
  delete obj.bucketName;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  return obj;
};

// 🔍 Compare hashed password with entered password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
