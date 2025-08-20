// 🔧 Load environment variables
require("dotenv").config({ path: "./config/.env" });

// 📦 Core modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// 🛠️ Custom modules
const connectDB = require("./database/connectDB");
const invalidJsonHandler = require("./middleware/invalidJsonHandler");
const globalErrorHandler = require("./utils/globalErrorHandler");
const rateLimit = require("express-rate-limit");
const ResponseHandler = require("./utils/responseHandler");
const appRoutes = require("./routes/index")

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

//   🌐 Middleware (Order Matters)

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

//🚦 Rate Limiter

const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 1000, // 1000 requests per minute
  handler: (req, res) => {
    ResponseHandler(res, 429, "⚠️ Too many requests, please slow down.");
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//   📌 Routes

app.get("/", async (req, res) => {
  res.send("  Server ready to serve response for requests!");
});
app.use("/api/v1", globalLimiter);
app.use("/api/v1", appRoutes);
app.use((req, res) => {
  ResponseHandler(res, 404, "   Route not found. Please check the URL.");
});

//⚠️ Error Handling

app.use(invalidJsonHandler);
app.use(globalErrorHandler);

//🔌 Database Connection & Server Start

const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
      //console.log("  Connected to MongoDB");

    app.listen(PORT, () => {
        //console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("   DB connection failed", error);
    process.exit(1);
  }
};

startServer();
