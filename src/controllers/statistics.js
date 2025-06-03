const statisticsService = require("../services/statisticsService");
const AppError = require("../utils/appError");

exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await statisticsService.getStatistics();
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    next(new AppError("Failed to fetch statistics", 500));
  }
};
