const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,

  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Album", albumSchema);
