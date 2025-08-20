/* ------------------------------------------------------
   🚦 Express-Rate-Limit (Per-IP Hard Limit)
--------------------------------------------------------- */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 100, // ⬆ bumped to avoid too many false 429
  message: "   Too many requests from this IP, slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

/* ------------------------------------------------------
   🌍 Global Request Cap (All IPs Combined)
   ⚡ Note: In distributed cloud, use Redis or DB counter
--------------------------------------------------------- */
let globalRequestCount = 0;
const GLOBAL_LIMIT = 1000; // total per minute (all IPs)
const WINDOW_MS = 60 * 1000;

setInterval(() => {
  globalRequestCount = 0;
}, WINDOW_MS);

function globalRateLimiter(req, res, next) {
  if (globalRequestCount >= GLOBAL_LIMIT) {
    return res.status(429).json({
      error: "🌍 Server busy - global request limit reached.",
    });
  }
  globalRequestCount++;
  next();
}

/* ------------------------------------------------------
   🌊 Leaky Bucket Algorithm (Fine-Grained Smoothing Per IP)
--------------------------------------------------------- */
const RATE = 2; // tokens/sec
const BURST = 10; // burst capacity
const buckets = new Map();

function leakyBucketMiddleware(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { lastCheck: now, tokens: BURST };
    buckets.set(ip, bucket);
  }

  // refill
  const delta = (now - bucket.lastCheck) / 1000;
  bucket.tokens = Math.min(BURST, bucket.tokens + delta * RATE);
  bucket.lastCheck = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return next();
  }
  return res.status(429).json({ error: "⏳ Too Many Requests - slow down" });
}
