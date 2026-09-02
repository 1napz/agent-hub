export const yourAgent = {
  name: "your-agent",
  description: "ทำอะไร",
  model: "openai/gpt-4o-mini", // เปลี่ยนโมเดล openrouter ได้
  systemPrompt: "You are...",
  run: async (input: string) => { ... }
}