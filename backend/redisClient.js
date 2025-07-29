const Redis = require('ioredis');

// Use the full Upstash Redis URL format
const redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxLoadingTimeout: 1,
  connectTimeout: 10000,
  commandTimeout: 5000,
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

redisClient.on('close', () => {
  console.log('🔌 Redis connection closed');
});

// Test the connection
redisClient.ping().then(result => {
  console.log('🏓 Redis ping result:', result);
}).catch(err => {
  console.error('❌ Redis ping failed:', err);
});

module.exports = redisClient;