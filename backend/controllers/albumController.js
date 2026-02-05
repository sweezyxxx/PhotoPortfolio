const mongoose = require("mongoose");
const Album = require("../models/Album");
const Photo = require("../models/Photo");

/* =======================
   CREATE ALBUM
======================= */

exports.createAlbum = async (req, res) => {
    try {
        const album = await Album.create({
            name: req.body.name,
            description: req.body.description,
            owner: req.user.id,
        });

        res.status(201).json({
            success: true,
            data: album,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};


/* =======================
   GET ALL USER ALBUMS
======================= */

exports.getAlbums = async (req, res) => {
    const albums = await Album.find()
        .populate("photos")
        .populate("owner", "name");

    res.json(albums);
};


/* =======================
   GET SINGLE ALBUM BY ID
======================= */

exports.getSingleAlbum = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const album = await Album.findById(req.params.id).populate("photos");

    if (!album) {
        return res.status(404).json({ message: "Not found" });
    }

    if (album.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    res.json({
        success: true,
        data: album,
    });
};


/* =======================
   ADD PHOTO TO ALBUM
======================= */

exports.addPhotoToAlbum = async (req, res) => {
    const { photoId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(photoId)) {
        return res.status(400).json({ message: "Invalid photo ID" });
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
    }

    const album = await Album.findOneAndUpdate(
        {
            _id: req.params.id,
            owner: req.user.id,
        },
        {
            $push: { photos: photoId },
        },
        {
            new: true,
        }
    ).populate("photos");

    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    res.json({
        success: true,
        data: album,
    });
};


/* =======================
   REMOVE PHOTO FROM ALBUM
======================= */

exports.removePhotoFromAlbum = async (req, res) => {
    const { photoId } = req.body;

    const album = await Album.findOneAndUpdate(
        {
            _id: req.params.id,
            owner: req.user.id,
        },
        {
            $pull: { photos: photoId },
        },
        {
            new: true,
        }
    ).populate("photos");

    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    res.json({
        success: true,
        data: album,
    });
};


/* =======================
   DELETE ALBUM
======================= */

exports.deleteAlbum = async (req, res) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        return res.status(404).json({ message: "Not found" });
    }

    if (album.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Thats not your album" });
    }

    await album.deleteOne();

    res.json({
        success: true,
        message: "Album deleted",
    });
};