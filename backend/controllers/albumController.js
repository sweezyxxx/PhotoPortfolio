const Album = require("../models/Album");

exports.createAlbum = async (req, res) => {
  const album = await Album.create({
    name: req.body.name,
    description: req.body.description,
    owner: req.user.id
  });

  res.status(201).json(album);
};

exports.addPhotoToAlbum = async (req, res) => {
  const album = await Album.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { photos: req.body.photoId } },
    { new: true }
  );

  res.json(album);
};

exports.removePhotoFromAlbum = async (req, res) => {
  const album = await Album.findByIdAndUpdate(
    req.params.id,
    { $pull: { photos: req.body.photoId } },
    { new: true }
  );

  res.json(album);
};

exports.getAlbums = async (req, res) => {
  const albums = await Album.find({ owner: req.user.id })
    .populate("photos");

  res.json(albums);
};
