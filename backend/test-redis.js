// test-redis.js - Run this to test your setup
const session = require('express-session');

console.log('Testing connect-redis imports...\n');

// Test 1: v7+ style
try {
  const RedisStore = require('connect-redis').default;
  console.log('✅ Method 1 works: connect-redis v7+ (ES6 modules)');
  console.log('   RedisStore:', typeof RedisStore);
} catch (err) {
  console.log('❌ Method 1 failed:', err.message);
}

// Test 2: v6 style  
try {
  const RedisStore = require('connect-redis')(session);
  console.log('✅ Method 2 works: connect-redis v6 (CommonJS)');
  console.log('   RedisStore:', typeof RedisStore);
} catch (err) {
  console.log('❌ Method 2 failed:', err.message);
}

// Test 3: Direct import
try {
  const RedisStore = require('connect-redis');
  console.log('✅ Method 3 works: connect-redis direct');
  console.log('   RedisStore:', typeof RedisStore);
} catch (err) {
  console.log('❌ Method 3 failed:', err.message);
}

// Check versions
console.log('\n📦 Package Versions:');
try {
  const sessionPkg = require('express-session/package.json');
  console.log('express-session:', sessionPkg.version);
} catch (err) {
  console.log('express-session: version not found');
}

try {
  const redisPkg = require('connect-redis/package.json');
  console.log('connect-redis:', redisPkg.version);
} catch (err) {
  console.log('connect-redis: version not found');
}

console.log('\n🔧 If all methods failed, run:');
console.log('npm uninstall connect-redis');
console.log('npm install connect-redis@6.1.3');