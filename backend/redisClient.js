const Redis = require('ioredis');
const redisClient = new Redis(); // Defaults to localhost:6379
module.exports = redisClient;
