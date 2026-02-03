const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },

  tags: [String],
  category: String,

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  views: {
    type: Number,
    default: 0
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
}, { timestamps: true });

photoSchema.index({ category: 1 });
photoSchema.index({ tags: 1 });
photoSchema.index({ owner: 1 });
photoSchema.index({ createdAt: -1 });
photoSchema.index({ views: -1 });

module.exports = mongoose.model("Photo", photoSchema);
