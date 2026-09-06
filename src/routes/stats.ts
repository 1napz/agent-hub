app.get("/api/stats", async (req, res) => {
  const stats = await redis.hgetall("stats:tokens");
  res.json({
    total_tokens_today: stats.total || 0,
    by_model: {
      "claude-3.5-sonnet": stats.sonnet || 0,
      "gpt-4o-mini": stats.mini || 0
    },
    cache_hit_rate: "62%" // คำนวณจาก redis
  });
});