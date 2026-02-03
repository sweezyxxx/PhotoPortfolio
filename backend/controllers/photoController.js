const mongoose = require("mongoose");
const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");

/* =======================
   CREATE
======================= */
exports.uploadPhoto = async (req, res) => {
    console.log("FILE PATH:", req.file?.path);
    try {
        const photo = await Photo.create({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            tags: req.body.tags ? req.body.tags.split(",") : [],
            category: req.body.category,
            owner: req.user.id
        });

        res.status(201).json({ success: true, data: photo });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/* =======================
   READ ALL (pagination + filters)
======================= */
exports.getPhotos = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;

    const photos = await Photo.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const count = await Photo.countDocuments(filter);

    res.json({
        success: true,
        count,
        page,
        data: photos
    });
};

/* =======================
   READ ONE
======================= */
exports.getSinglePhoto = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ message: "Invalid ID" });

    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, data: photo });
};

/* =======================
   UPDATE (owner only)
======================= */
exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Not found" });

    if (photo.owner.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });

    if (req.body.title) photo.title = req.body.title;
    if (req.body.description) photo.description = req.body.description;
    if (req.body.category) photo.category = req.body.category;
    if (req.body.tags) photo.tags = req.body.tags.split(",");

    await photo.save();
    res.json({ success: true, data: photo });
};

/* =======================
   DELETE (Mongo + Cloudinary)
======================= */
exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Not found" });

    if (photo.owner.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });

    await cloudinary.uploader.destroy(photo.publicId);
    await photo.deleteOne();

    res.json({ success: true, message: "Photo deleted" });
};

/* =======================
   ADVANCED UPDATES
======================= */
exports.viewPhoto = async (req, res) => {
    const photo = await Photo.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!photo) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, data: photo });
};

exports.toggleLike = async (req, res) => {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = photo.likes.includes(userId);

    if (alreadyLiked) {
        photo.likes.pull(userId);
    } else {
        photo.likes.addToSet(userId);
    }

    await photo.save();

    res.json({
        success: true,
        liked: !alreadyLiked,
        likesCount: photo.likes.length
    });
};



/* =======================
   AGGREGATIONS (NoSQL core)
======================= */
exports.getPopularPhotos = async (req, res) => {
    const photos = await Photo.aggregate([
        { $sort: { views: -1 } },
        { $limit: 6 }
    ]);

    res.json({ success: true, data: photos });
};

exports.photosByCategory = async (req, res) => {
    const stats = await Photo.aggregate([
        { $group: { _id: "$category", total: { $sum: 1 } } }
    ]);

    res.json({ success: true, data: stats });
};

exports.uploadsPerMonth = async (req, res) => {
    const stats = await Photo.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                total: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: stats });
};

exports.addView = async (req, res) => {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
    }

    photo.views += 1;
    await photo.save();

    res.json({
        success: true,
        views: photo.views
    });
};
