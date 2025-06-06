const cache = require("../utils/cache");

const cacheResponse = (ttl) => {
  return async (req, res, next) => {
    if (process.env.NODE_ENV === "test") return next();

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await cache.get(key);
      if (cachedData) {
        return res.status(200).json({
          status: "success",
          data: cachedData,
          fromCache: true,
        });
      }

      // Override res.json to cache responses
      const originalJson = res.json;
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(key, body.data || body, ttl);
        }
        originalJson.call(res, body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = { cacheResponse };
