const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { validateProfileUpdate } = require("../middleware/validate");
const {
    getProfile,
    updateProfile
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, validateProfileUpdate, updateProfile);

module.exports = router;
