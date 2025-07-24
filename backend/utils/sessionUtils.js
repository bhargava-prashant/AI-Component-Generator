const redisClient = require('../redisClient');

exports.getAllSessions = async () => {
  return new Promise((resolve, reject) => {
    redisClient.keys('sess:*', async (err, keys) => {
      if (err) return reject(err);
      if (!keys.length) return resolve([]);

      redisClient.mget(keys, (err, sessions) => {
        if (err) return reject(err);
        const parsed = sessions.map((s, i) => ({
          key: keys[i],
          data: JSON.parse(s)
        }));
        resolve(parsed);
      });
    });
  });
};
