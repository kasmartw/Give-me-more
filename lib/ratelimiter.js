import { RateLimiterMemory } from "rate-limiter-flexible";

 const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

export default async function rateLimiterMiddleware(ip) {
  try {
    await rateLimiter.consume(ip);
    return false;
  } catch {
    return true;
  }
}
