export const claudeAgent = {
  name: "claude",
  model: "anthropic/claude-3.5-sonnet", // เรียกผ่าน OpenRouter
  instructions: `
  คุณคือ Claude ที่อยู่ใน agent-hub
  เก่งเรื่อง: อธิบายโค้ด, รีวิว PR, เขียนเทส
  ตอบเป็นภาษาไทย สุภาพ ชัดเจน
  `,
  run: async (input, instructions) => {
    // ยิงไป openrouter ด้วย model anthropic/claude-3.5-sonnet
  }
}