export async function runAgentWithHealing(agent, userInput) {
  let attempts = 0;
  let lastError = null;
  
  while (attempts < 3) {
    try {
      const result = await callOpenRouter({
        model: agent.model,
        messages: [
          {role: "system", content: agent.instructions},
          {role: "user", content: userInput}
        ]
      });
      
      // 1. Health Check: ถ้าตอบเป็น JSON แต่พัง
      if (agent.response_format === "json") {
        JSON.parse(result.content); // จะ throw ถ้า JSON เสีย
      }
      
      return result; // ผ่าน -> จบ
      
    } catch (error) {
      attempts++;
      lastError = error;
      console.log(`Attempt ${attempts} failed: ${error.message}`);
      
      // 2. Self-healing: แก้ prompt แล้วลองใหม่
      agent.instructions += `\n\n[IMPORTANT] รอบที่แล้วคุณตอบผิด: ${error.message}. กรุณาตอบให้ถูกต้องตาม format`
    }
  }
  
  // 3. Fallback: ถ้า 3 รอบยังพัง ให้สลับไปใช้โมเดลถูกๆ
  console.log("Fallback to gpt-4o-mini");
  return await callOpenRouter({
    model: "openai/gpt-4o-mini",
    messages: [...]
  });
}