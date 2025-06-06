const Song = require("../models/Song");
const cache = require("../utils/cache");
const logger = require("../config/logger");

const getStatistics = async () => {
  try {
    const cacheKey = "statistics";
    const cachedStats = await cache.get(cacheKey);

    if (cachedStats) return cachedStats;

    // Execute all queries in parallel for better performance
    const [
      totalSongs,
      artists,
      albums,
      genres,
      songsPerGenre,
      artistStats,
      albumStats,
    ] = await Promise.all([
      Song.countDocuments(),
      Song.distinct("artist"),
      Song.distinct("album"),
      Song.distinct("genre"),
      Song.aggregate([{ $group: { _id: "$genre", count: { $sum: 1 } } }]),
      Song.aggregate([
        {
          $group: {
            _id: "$artist",
            songs: { $sum: 1 },
            albums: { $addToSet: "$album" },
          },
        },
        {
          $project: {
            artist: "$_id",
            songs: 1,
            albums: { $size: "$albums" },
          },
        },
      ]),
      Song.aggregate([
        {
          $group: {
            _id: { artist: "$artist", album: "$album" },
            songs: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            artist: "$_id.artist",
            album: "$_id.album",
            songs: 1,
          },
        },
      ]),
    ]);

    const result = {
      totalSongs,
      totalArtists: artists.length,
      totalAlbums: albums.length,
      totalGenres: genres.length,
      songsPerGenre,
      songsAndAlbumsPerArtist: artistStats,
      songsPerAlbum: albumStats,
      lastUpdated: new Date(),
    };

    await cache.set(cacheKey, result, 600); // Cache for 10 minutes
    return result;
  } catch (error) {
    logger.error("Statistics service error:", error);
    throw error; // Rethrow for controller to handle
  }
};

module.exports = { getStatistics };
