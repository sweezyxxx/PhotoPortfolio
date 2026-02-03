const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum,
  getAlbums,
  getSingleAlbum,
  deleteAlbum
} = require("../controllers/albumController");

router.post("/", auth, createAlbum);
router.get("/", auth, getAlbums);
router.get("/:id", auth, getSingleAlbum);

router.post("/:id/photos", auth, addPhotoToAlbum);
router.delete("/:id/photos", auth, removePhotoFromAlbum);

router.delete("/:id", auth, deleteAlbum);

module.exports = router;
