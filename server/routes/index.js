const express = require("express");
const appRoutes = express.Router();

// make sure the filename matches exactly (check your folder!)
const UserRouter = require("./userRoute")

appRoutes.use("/user", UserRouter);

module.exports = appRoutes;
