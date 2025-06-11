const songService = require("../services/songService");
const AppError = require("../utils/appError");

// Handle success responses consistently
const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

exports.createSong = async (req, res, next) => {
  try {
    const song = await songService.createSong(req.body);
    sendResponse(res, 201, song);
  } catch (error) {
    next(error);
  }
};

exports.getSongs = async (req, res, next) => {
  try {
    const songs = await songService.getAllSongs(req.query);
    sendResponse(res, 200, songs);
  } catch (error) {
    next(error);
  }
};

exports.updateSong = async (req, res, next) => {
  try {
    const song = await songService.updateSong(req.params.id, req.body);
    if (!song) return next(new AppError("Song not found", 404));
    sendResponse(res, 200, song);
  } catch (error) {
    next(error);
  }
};

exports.deleteSong = async (req, res, next) => {
  try {
    const song = await songService.deleteSong(req.params.id);
    if (!song) return next(new AppError("Song not found", 404));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
// controller/song.js (add this)
exports.searchSongs = async (req, res, next) => {
  try {
    const songs = await songService.searchSongs(req.query.q); // Assuming 'q' as query parameter
    sendResponse(res, 200, songs);
  } catch (error) {
    next(error);
  }
};
