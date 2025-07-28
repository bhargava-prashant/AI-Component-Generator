
const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keyPrefix: '', // We'll handle prefixes manually for better control
  maxMemoryPolicy: 'allkeys-lru', // Automatically evict old keys when memory is full
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis successfully!');
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

// Helper methods for session management
redisClient.setSessionData = async (key, data, ttl = 86400) => {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('❌ Error setting session data:', error);
    return false;
  }
};

redisClient.getSessionData = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Error getting session data:', error);
    return null;
  }
};

redisClient.deleteSessionData = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('❌ Error deleting session data:', error);
    return false;
  }
};

module.exports = redisClient;
