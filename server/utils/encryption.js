const crypto = require("crypto");

//   Use SHA-256 hash of secret and slice the first 32 BYTES (not base64 string)
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(String(process.env.API_ENCRYPTION_SECRET))
  .digest(); // returns a 32-byte Buffer

const IV_LENGTH = 16; // For AES, this must be 16

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(encryptedText) {
  const parts = encryptedText.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encrypted = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

module.exports = { encrypt, decrypt };
