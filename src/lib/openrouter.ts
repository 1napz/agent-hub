export async function callOpenRouter({messages, model}) {
  return await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://github.com/zyntromedia/agent-hub",
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      
      // 1. ตัด token ขาเข้า
      max_tokens: 512, // จำกัดคำตอบ ไม่ให้ยืด
      temperature: 0.3, // ต่ำ = ตอบตรง ประหยัดรอบแก้
      
      // 2. ใช้ cache ของ OpenRouter
      usage: { include: true },
      
      // 3. Force JSON ตอนที่ทำได้
      response_format: { type: "json_object" } // ลด token อธิบาย
    })
  })
}