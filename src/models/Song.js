const mongoose = require("mongoose");
const validator = require("validator");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      minlength: [2, "Title must be at least 2 characters"],
    },
    artist: {
      type: String,
      required: [true, "Artist is required"],
      trim: true,
      maxlength: [100, "Artist name cannot exceed 100 characters"],
    },
    album: {
      type: String,
      required: [true, "Album is required"],
      trim: true,
      maxlength: [100, "Album name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      enum: {
        values: [
          "Pop",
          "Rock",
          "Jazz",
          "Classical",
          "Hip Hop",
          "R&B",
          "Country",
          "Electronic",
          "Reggae",
          "Metal",
          "Folk",
          "Other",
        ],
        message: "Invalid genre selection",
      },
    },
    releaseYear: {
      type: Number,
      min: [1900, "Release year must be after 1900"],
      max: [new Date().getFullYear(), "Release year cannot be in the future"],
    },
    duration: {
      type: Number,
      min: [10, "Duration must be at least 10 seconds"],
    },
    trackNumber: {
      type: Number,
      min: [1, "Track number must be at least 1"],
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for faster queries
songSchema.index({ artist: 1, album: 1 });
songSchema.index({ genre: 1, artist: 1 });
songSchema.index({ createdAt: -1 });

// Virtual for formatted duration
songSchema.virtual("formattedDuration").get(function () {
  if (!this.duration) return null;
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Pre-save hook for data normalization
songSchema.pre("save", function (next) {
  // Normalize capitalization
  this.title =
    this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
  this.artist = this.artist.trim().replace(/\s+/g, " ");
  this.album = this.album.trim().replace(/\s+/g, " ");
  this.genre = this.genre.trim();

  next();
});

// Static method for bulk operations
songSchema.statics.updateMultiple = async (ids, updateData) => {
  return this.updateMany(
    { _id: { $in: ids } },
    { $set: updateData },
    { runValidators: true }
  );
};

// Query helper for filtering
songSchema.query.byArtist = function (artist) {
  return this.where({ artist: new RegExp(artist, "i") });
};

songSchema.query.byGenre = function (genre) {
  return this.where({ genre: new RegExp(genre, "i") });
};

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
