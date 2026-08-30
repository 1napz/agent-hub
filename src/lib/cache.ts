import { createClient } from "redis";
import { createHash } from "crypto";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

export async function withCache(key: string, fn: () => Promise<any>) {
  const hash = createHash("md5").update(key).digest("hex");
  
  const cached = await redis.get(`agent:${hash}`);
  if (cached) {
    console.log("[CACHE HIT]");
    return JSON.parse(cached);
  }

  const result = await fn();
  await redis.set(`agent:${hash}`, JSON.stringify(result), { EX: 86400 }); // cache 24 ชม
  console.log("[CACHE MISS]");
  return result;
}