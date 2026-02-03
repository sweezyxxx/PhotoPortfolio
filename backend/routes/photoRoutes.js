const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validatePhoto } = require("../middleware/validate");

const {
    uploadPhoto,
    getPhotos,
    getSinglePhoto,
    updatePhoto,
    deletePhoto,
    viewPhoto,
    toggleLike,
    getPopularPhotos,
    photosByCategory,
    uploadsPerMonth,
    addView
} = require("../controllers/photoController");

router.get("/", getPhotos);

router.get("/stats/popular", getPopularPhotos);
router.get("/stats/categories", photosByCategory);
router.get("/stats/monthly", uploadsPerMonth);

router.post(
    "/",
    auth,
    upload.single("image"),
    validatePhoto,
    uploadPhoto
);


router.get("/:id", getSinglePhoto);
router.put("/:id", auth, updatePhoto);
router.delete("/:id", auth, deletePhoto);

router.get("/:id/view", viewPhoto);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/view", addView);
module.exports = router;
