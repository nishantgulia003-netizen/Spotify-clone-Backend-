const mongoose = require("mongoose");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = new Set(["user", "artist"]);

function validationError(res, errors) {
  return res.status(400).json({
    message: "Validation failed",
    errors,
  });
}

function validateRegister(req, res, next) {
  const { username, email, password, role } = req.body || {};
  const errors = [];

  if (typeof username !== "string" || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    errors.push("A valid email address is required");
  }
  if (typeof password !== "string" || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (role !== undefined && !ROLES.has(role)) {
    errors.push("Role must be either user or artist");
  }

  if (errors.length) return validationError(res, errors);

  req.body.username = username.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

function validateLogin(req, res, next) {
  const { username, email, password } = req.body || {};
  const errors = [];

  if (typeof username !== "string" && typeof email !== "string") {
    errors.push("Username or email is required");
  }
  if (username !== undefined && (typeof username !== "string" || !username.trim())) {
    errors.push("Username must be a non-empty string");
  }
  if (email !== undefined && (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim()))) {
    errors.push("Email must be valid");
  }
  if (typeof password !== "string" || !password) {
    errors.push("Password is required");
  }

  if (errors.length) return validationError(res, errors);

  if (typeof username === "string") req.body.username = username.trim();
  if (typeof email === "string") req.body.email = email.trim().toLowerCase();
  next();
}

function validateMusicUpload(req, res, next) {
  const { title } = req.body || {};
  const errors = [];

  if (typeof title !== "string" || !title.trim()) errors.push("Title is required");
  if (!req.file) errors.push("Music file is required");

  if (errors.length) return validationError(res, errors);

  req.body.title = title.trim();
  next();
}

function validateCreateAlbum(req, res, next) {
  const { title, musics } = req.body || {};
  const errors = [];

  if (typeof title !== "string" || !title.trim()) errors.push("Title is required");
  if (!Array.isArray(musics) || musics.length === 0) {
    errors.push("At least one music ID is required");
  } else if (!musics.every((musicId) => mongoose.isValidObjectId(musicId))) {
    errors.push("Every music ID must be valid");
  }

  if (errors.length) return validationError(res, errors);

  req.body.title = title.trim();
  next();
}

function validateAlbumId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.albumId)) {
    return validationError(res, ["Album ID must be valid"]);
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateMusicUpload,
  validateCreateAlbum,
  validateAlbumId,
};
