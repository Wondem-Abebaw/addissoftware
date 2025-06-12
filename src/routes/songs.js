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
router.get("/get-songs", songController.getSongs);

// router.get("/get-song/:id", songController.getSong);

router.post("/create-song", songController.createSong);
router.delete("/delete-song/:id", songController.deleteSong);
router.put("/update-song/:id", songController.updateSong);

// router
//   .route("/:id")
//   .put(songController.updateSong)
//   .delete(songController.deleteSong);

module.exports = router;
