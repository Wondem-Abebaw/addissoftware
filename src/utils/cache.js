const redis = require("redis");
const { promisify } = require("util");
const logger = require("../config/logger");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => logger.error("Redis Client Error", err));
(async () => {
  await client.connect(); //
})();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const keysAsync = promisify(client.keys).bind(client);

// Pattern-based deletion for cache invalidation
const delPattern = async (pattern) => {
  const keys = await keysAsync(pattern);
  if (keys.length) await delAsync(...keys);
};

module.exports = {
  get: async (key) => {
    const data = await getAsync(key);
    return data ? JSON.parse(data) : null;
  },

  set: async (key, value, ttl = 300) => {
    // Default 5 minutes
    await setAsync(key, JSON.stringify(value), "EX", ttl);
  },

  del: async (key) => {
    await delAsync(key);
  },

  delPattern: async (pattern) => {
    await delPattern(pattern);
  },
};
