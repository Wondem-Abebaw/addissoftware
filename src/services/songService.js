const Song = require("../models/Song");
const cache = require("../utils/cache");

const createSong = async (songData) => {
  const song = await Song.create(songData);
  cache.del("songs:*");
  return song;
};

const getSongById = async (id) => {
  const cacheKey = `song:${id}`;
  const cachedSong = await cache.get(cacheKey);

  if (cachedSong) return cachedSong;

  const song = await Song.findById(id);
  if (song) await cache.set(cacheKey, song);
  return song;
};

const getAllSongs = async (queryParams) => {
  const cacheKey = `songs:${JSON.stringify(queryParams)}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) return cachedData;

  // Advanced filtering, sorting, pagination
  const features = new ApiFeatures(Song.find(), queryParams)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const songs = await features.query;
  await cache.set(cacheKey, songs);
  return songs;
};

const updateSong = async (id, updateData) => {
  const song = await Song.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (song) {
    cache.del(`song:${id}`);
    cache.del("songs:*");
  }

  return song;
};

const deleteSong = async (id) => {
  const song = await Song.findByIdAndDelete(id);
  if (song) {
    cache.del(`song:${id}`);
    cache.del("songs:*");
  }
  return song;
};

module.exports = {
  createSong,
  getSongById,
  getAllSongs,
  updateSong,
  deleteSong,
};
