const express = require("express");
const cookieParser = require("cookie-parser");
const userModel = require("./Model/user.model");
const authRouter = require("./Routes/auth.router")
const musicRouter = require("./Routes/music.router");
const musicModel = require("./Model/music.model");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.use("/api/auth",authRouter);
app.use("/api/music",musicRouter);
app


module.exports = app;
