import { runAgentWithHealing } from "../lib/agent-runner";
import { smartAgent } from "../agents/smart-agent";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  
  const result = await runAgentWithHealing(smartAgent, message);
  
  res.json({
    answer: result.content,
    meta: {
      model: result.model,
      tokens: result.usage.total_tokens
    }
  });
});