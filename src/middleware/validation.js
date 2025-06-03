const { body, validationResult } = require("express-validator");
const AppError = require("../utils/appError");

exports.validateSong = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("artist").trim().notEmpty().withMessage("Artist is required"),
  body("album").trim().notEmpty().withMessage("Album is required"),
  body("genre").trim().notEmpty().withMessage("Genre is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((err) => err.msg)
        .join(". ");
      return next(new AppError(message, 400));
    }
    next();
  },
];
