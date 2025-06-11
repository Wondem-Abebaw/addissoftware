const Song = require("../models/Song");
const ApiFeatures = require("../utils/apiFeature");

const createSong = async (songData) => {
  const song = await Song.create(songData);
  return song;
};

const getSongById = async (id) => {
  const song = await Song.findById(id);
  return song;
};

const getAllSongs = async (queryParams) => {
  const features = new ApiFeatures(Song.find(), queryParams)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const songs = await features.query;
  return songs;
};

const updateSong = async (id, updateData) => {
  const song = await Song.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return song;
};

const deleteSong = async (id) => {
  const song = await Song.findByIdAndDelete(id);
  return song;
};

const createBulkSongs = async (songs) => {
  const createdSongs = await Song.insertMany(songs);
  return createdSongs;
};

const deleteBulkSongs = async () => {
  const result = await Song.deleteMany({});
  return result;
};

const searchSongs = async (query) => {
  const songs = await Song.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { artist: { $regex: query, $options: "i" } },
    ],
  });
  return songs;
};

module.exports = {
  createSong,
  getSongById,
  getAllSongs,
  updateSong,
  deleteSong,
  createBulkSongs,
  deleteBulkSongs,
  searchSongs,
};
