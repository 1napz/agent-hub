import { callOpenRouter } from "./openrouter";

interface Agent {
  name: string;
  model: string;
  fallback_model: string;
  instructions: string;
  max_tokens?: number;
  response_format?: "json" | "text";
}

export async function runAgentWithHealing(agent: Agent, userInput: string) {
  let attempts = 0;
  const maxAttempts = 3;
  let currentModel = agent.model;
  let messages = [
    { role: "system" as const, content: agent.instructions },
    { role: "user" as const, content: userInput }
  ];

  while (attempts < maxAttempts) {
    try {
      console.log(`[${agent.name}] Attempt ${attempts + 1} with ${currentModel}`);
      
      const res = await callOpenRouter({
        model: currentModel,
        messages,
        max_tokens: agent.max_tokens || 512,
        temperature: 0.2,
        response_format: agent.response_format ? { type: agent.response_format } : undefined
      });

      const content = res.choices[0].message.content;
      const usage = res.usage; // เอาไว้ดูว่าใช้กี่ token

      // Self-healing check 1: ถ้าสั่งให้ตอบ JSON แต่ได้ขยะ
      if (agent.response_format === "json") {
        try {
          JSON.parse(content);
        } catch {
          throw new Error("Invalid JSON response");
        }
      }

      // Self-healing check 2: ถ้าตอบว่า "ไม่รู้" แต่จริงๆถามง่าย
      if (content.includes("ไม่ทราบ") && userInput.length < 20) {
        throw new Error("Lazy response detected");
      }

      console.log(`[${agent.name}] Success. Tokens used: ${usage.total_tokens}`);
      return { content, usage, model: currentModel };

    } catch (error: any) {
      attempts++;
      console.error(`[${agent.name}] Error: ${error.message}`);

      // Healing Strategy 1: แก้ prompt แล้วลองใหม่
      if (attempts < maxAttempts) {
        messages[0].content += `\n\n[HEALING] รอบที่แล้วคุณผิด: ${error.message}. กรุณาแก้และตอบให้ถูกต้อง`;
      }
      
      // Healing Strategy 2: ถ้า fail 2 รอบ สลับไปโมเดลถูก
      if (attempts === 2) {
        currentModel = agent.fallback_model;
        console.log(`[${agent.name}] Falling back to ${currentModel}`);
      }
    }
  }

  // ถ้าพังหมด ให้ตอบแบบปลอดภัย
  return { 
    content: "ระบบขัดข้องชั่วคราวครับ ลองใหม่อีกครั้งได้ไหม", 
    usage: { total_tokens: 0 },
    model: "none"
  };
}