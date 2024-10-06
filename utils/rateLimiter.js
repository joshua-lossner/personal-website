import { RateLimiter } from 'limiter';

const limiters = new Map();

const LIMITER_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

function getIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

function getLimiter(ip) {
  if (!limiters.has(ip)) {
    limiters.set(ip, new RateLimiter({
      tokensPerInterval: 100,
      interval: "minute",
      fireImmediately: true
    }));
  }
  return limiters.get(ip);
}

function cleanupLimiters() {
  const now = Date.now();
  for (const [ip, limiter] of limiters.entries()) {
    if (now - limiter.lastActive > LIMITER_CLEANUP_INTERVAL) {
      limiters.delete(ip);
    }
  }
}

setInterval(cleanupLimiters, LIMITER_CLEANUP_INTERVAL);

export async function rateLimiter(req, res) {
  const ip = getIp(req);
  const limiter = getLimiter(ip);
  const remainingTokens = await limiter.removeTokens(1);
  console.log(`IP: ${ip}, Remaining tokens: ${remainingTokens}`);
  if (remainingTokens < 0) {
    console.log(`Rate limit exceeded for IP: ${ip}`);
    res.status(429).json({ error: 'Too many requests, please try again later.' });
    return false;
  }
  return true;
}