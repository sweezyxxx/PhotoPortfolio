const User = require("../models/User");

/* =======================
   GET PROFILE
======================= */
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    success: true,
    data: user
  });
};

/* =======================
   UPDATE PROFILE
======================= */
exports.updateProfile = async (req, res) => {
  const allowedFields = ["username", "email"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field]) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true }
  ).select("-password");

  res.json({
    success: true,
    data: user
  });
};
