const express = require("express");
const router = express.Router();
const songController = require("../controllers/songs");

// const validationMiddleware = require("../middleware/validation");
// const cacheMiddleware = require("../middleware/cache");
// const rateLimitMiddleware = require("../middleware/rateLimit");

// Apply rate limiting to write operations
// router.use(rateLimitMiddleware.apiLimiter);

// Public routes (read-only)
// Search endpoint
router.get("/search", songController.searchSongs);
// // Bulk operations
// router
//   .route("/bulk")
//   .post(songController.createBulkSongs)
//   .delete(songController.deleteBulkSongs);
router.route("/", songController.getSongs);

router.route("/:id", songController.getSong);

router.route("/").post(songController.createSong);

router
  .route("/:id")
  .put(songController.updateSong)
  .delete(songController.deleteSong);

module.exports = router;
