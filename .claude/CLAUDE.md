# CLAUDE.md

นี่คือ agent-hub: Backend สำหรับรวม AI Agents ผ่าน OpenRouter

## คำสั่งที่สำคัญ
- `npm run dev` : รัน dev server
- `npm run build` : build production  
- `docker build -t agent-hub .` : build docker

## โครงสร้าง
`src/agents/` = เก็บ Agent แต่ละตัว 1 ไฟล์ = 1 Agent
`src/lib/openrouter.ts` = client สำหรับยิง OpenRouter API

## กฎการเขียนโค้ด
1. ใช้ TypeScript + ESM เท่านั้น
2. ทุก Agent ต้องมี: name, model, instructions, run()
3. ห้าม hardcode API Key ให้อ่านจาก process.env เท่านั้น
4. ตอบ error เป็น {error: "message"} เสมอ

## เวลาเพิ่ม Agent ใหม่
1. สร้างไฟล์ใน src/agents/
2. ไป register ที่ src/agents/index.ts
3. test ด้วย curl ก่อน