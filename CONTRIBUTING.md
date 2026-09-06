### *CONTRIBUTING.md*
# Contributing to agent-hub

ขอบคุณที่สนใจช่วยพัฒนา agent-hub! 🎉 
repo นี้เป็นศูนย์รวม AI Agents ที่ใช้ OpenRouter เป็นหลัก เป้าหมายคือให้ dev เพิ่ม Agent ใหม่ได้ง่ายๆ ภายใน 5 นาที

## วิธีเริ่มต้น

### 1. Fork & Clone
```bash
git clone https://github.com/zyntromedia/agent-hub
cd agent-hub
### 2. ติดตั้ง
npm install
cp .env.example .env
ใส่ `OPENROUTER_API_KEY=sk-or-v1-xxx` ใน `.env`

### 3. รัน dev
npm run dev
server จะรันที่ `http://localhost:3000`

## โครงสร้างโปรเจกต์
agent-hub/
├── src/
│   ├── agents/         # ใส่ Agent ใหม่ตรงนี้
│   ├── routes/         # API routes
│   ├── lib/            # openrouter client, utils
│   └── index.ts        # entry
├── Dockerfile
└── .github/workflows/  # CI/CD
## วิธีเพิ่ม Agent ใหม่
1.  สร้างไฟล์ใน `src/agents/your-agent.ts`
export const yourAgent = {
  name: "your-agent",
  description: "ทำอะไร",
  model: "openai/gpt-4o-mini", // เปลี่ยนโมเดล openrouter ได้
  systemPrompt: "You are...",
  run: async (input: string) => { ... }
}
2.  ไป register ใน `src/agents/index.ts`
3.  Test ด้วย `curl -X POST http://localhost:3000/api/chat -d '{"agent":"your-agent","message":"hi"}'`

## Coding Guidelines
- *ภาษา*: TypeScript + ESM
- *Linter*: `npm run lint` ต้องผ่านก่อน PR
- *Commit*: ใช้ Conventional Commits `feat:`, `fix:`, `docs:`
- *Docker*: ต้อง build ผ่าน `docker build -t agent-hub .`

## Pull Request Process
1.  สร้าง branch ใหม่: `git checkout -b feat/add-summarizer-agent`
2.  Commit + Push
3.  เปิด PR แล้วอธิบายว่า Agent ทำอะไร + ตัวอย่าง request/response
4.  CI ต้องเขียว: build + lint
5.  รอ Review จาก Maintainer

## รายงาน Bug
เปิด Issue แล้วใส่:
- ขั้นตอนการ reproduce
- Log error
- เวอร์ชัน Node, OS

## Security
ห้าม commit `.env` หรือ `OPENROUTER_API_KEY` เด็ดขาด
เจอช่องโหว่แจ้งที่ security@zyntro.media

---

มีคำถาม? มาคุยกันใน Discussions ได้เลย
ขอบคุณที่ช่วยทำให้ agent-hub เก่งขึ้นนะครับ 🙌

### **ไฟล์ที่ควรมีคู่กัน**
1.  **`.env.example`**
    ```env
    PORT=3000
    OPENROUTER_API_KEY=sk-or-v1-your-key-here
2.  *`.dockerignore`*
    node_modules
    .git
    .env
เอาไปวางแล้ว PR แรกของ contributor จะง่ายขึ้นเยอะเลย

อยากให้ผมเพิ่มส่วน "Code of Conduct" หรือ "Good First Issues" ให้ด้วยไหมคะ?