const musicModel = require("../Model/music.model");
const albumModel = require("../Model/album.model")
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../Services/storage.service")

async function uploadMusic(req, res) {

    const { title } = req.body || {};
    const file = req.file;
    if (!title || !file) {
      return res.status(400).json({ message: "Title and music file are required" });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    return res.status(201).json({
      message: "Music is created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
}

async function createAlbum(req,res){
      

      const {title, musics} = req.body;

      if (!title || !Array.isArray(musics) || musics.length === 0) {
        return res.status(400).json({
          message: "Title and at least one music ID are required"
        });
      }

      const album = await albumModel.create({
        title,
        artist:req.user.id,
        musics
      });

      return res.status(201).json({
        message: "Album is created successfully",
        album:{
          id:album._id,
          title: album.title,
          artist: album.artist,
          musics: album.musics
        }
      });
}

async function getAllMusic(req,res){
 try{ const music = await musicModel
            .find()
            .skip(1)
            .limit(2)
            .populate("artist","username email");

  res.status(200).json({
    message: "Music fetched successfully",
    music
  })
 }
 catch(err){
  console.log(err);
  res.status(500).json({ message: "Failed to fetch music", error: err.message });
 }
}

async function getAllAlbums(req,res){
  const albums = await albumModel.find().select("title artist").populate("artist","username email")

  res.status(200).json({
    message: "All Albums are fetched",
    albums: albums

  })
}

async function getAlbumsByIds(req,res){
  const albumId = req.params.albumId;

  try {
    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username email")
      .populate("musics");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    return res.status(200).json({
      message: "Album fetched successfully",
      album,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid album ID" });
    }

    return res.status(500).json({ message: "Failed to fetch album", error: err.message });
  }

}

module.exports = { uploadMusic ,createAlbum ,getAllMusic ,getAllAlbums,getAlbumsByIds};
