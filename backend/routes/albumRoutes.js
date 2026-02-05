const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum,
  getAlbums,
  getSingleAlbum,
  deleteAlbum,
} = require("../controllers/albumController");

router.post("/", auth, createAlbum);
router.get("/", getAlbums);
router.get("/:id", getSingleAlbum);
router.delete("/:id", auth, deleteAlbum);

router.post("/:id/photos", auth, addPhotoToAlbum);
router.delete("/:id/photos", auth, removePhotoFromAlbum);


module.exports = router;