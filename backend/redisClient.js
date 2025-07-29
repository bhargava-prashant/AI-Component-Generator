const Redis = require('ioredis');

// Use the full Upstash Redis URL format
const redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Upstash Redis successfully!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redisClient.on('ready', () => {
  console.log('🔥 Redis client is ready!');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis client is reconnecting...');
});

module.exports = redisClient;
