const express = require("express");
const router = express.Router();
const musicController = require("../Controller/music.controller");
const authMiddleware = require("../Middleware/auth.middleware")
const {
    validateMusicUpload,
    validateCreateAlbum,
    validateAlbumId,
} = require("../Middleware/validation.middleware");
const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage()
})
router.post("/uploadMusic",authMiddleware.authArtist,upload.single("music"),validateMusicUpload,musicController.uploadMusic);
router.post("/createAlbum",authMiddleware.authArtist,validateCreateAlbum,musicController.createAlbum);
router.get("/allMusic",authMiddleware.authUser,musicController.getAllMusic);
router.get("/albums",authMiddleware.authUser,musicController.getAllAlbums);
router.get("/albums/:albumId",authMiddleware.authUser,validateAlbumId,musicController.getAlbumsByIds);

module.exports = router;
