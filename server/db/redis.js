const Redis = require("ioredis");

const REDIS_URI = process.env.REDIS_URI;
let redis;

if (!redis) {
  if (process.env.NODE_ENV === "production") {
    redis = new Redis(REDIS_URI);
  } else {
    redis = new Redis();
  }
}

module.exports = redis;