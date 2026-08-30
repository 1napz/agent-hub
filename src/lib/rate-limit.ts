import { createClient } from "redis";
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

export async function rateLimit(ip: string) {
  const key = `rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60); // 1 นาที
  
  if (count > 20) { // 20 ครั้ง/นาที
    throw new Error("ยิงเยอะไปครับ รอ 1 นาทีนะ");
  }
  return true;
}