export const smartAgent = {
  name: "smart-agent",
  model: "anthropic/claude-3.5-sonnet", // ตัวหลัก เก่งแต่แพง
  fallback_model: "openai/gpt-4o-mini", // ตัวสำรอง ถูก 10x
  
  instructions: `
  คุณคือผู้ช่วยที่ประหยัดและแม่นยำ
  Rules: 
    1. ตอบสั้น ตรงประเด็น
    2. ถ้าไม่รู้ให้ตอบ "ไม่ทราบครับ" อย่ามโน
    3. ตอบเป็น JSON: {"answer": "", "sources": []}
  `,
  
  max_tokens: 300,
  temperature: 0.2,
  retry: 3,
  enable_cache: true // เปิด cache openrouter
}