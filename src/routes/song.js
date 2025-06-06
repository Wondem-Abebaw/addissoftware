const express = require("express");
const router = express.Router();
const songController = require("../controllers/songs");
const validationMiddleware = require("../middleware/validation");
const cacheMiddleware = require("../middleware/cache");
const rateLimitMiddleware = require("../middleware/rateLimit");
const authMiddleware = require("../middleware/auth");

// Apply rate limiting to write operations
router.use(rateLimitMiddleware.apiLimiter);

// Public routes (read-only)
router.route("/").get(
  cacheMiddleware.cacheResponse(300), // Cache for 5 minutes
  songController.getSongs
);

router
  .route("/:id")
  .get(cacheMiddleware.cacheResponse(300), songController.getSong);

// Protected routes (write operations)
router.use(authMiddleware.protect);

router
  .route("/")
  .post(validationMiddleware.validateSong, songController.createSong);

router
  .route("/:id")
  .put(validationMiddleware.validateSong, songController.updateSong)
  .delete(songController.deleteSong);

// Bulk operations
router
  .route("/bulk")
  .post(
    authMiddleware.restrictTo("admin"),
    validationMiddleware.validateBulkSongs,
    songController.createBulkSongs
  )
  .delete(authMiddleware.restrictTo("admin"), songController.deleteBulkSongs);

// Search endpoint
router.get("/search", songController.searchSongs);

module.exports = router;
