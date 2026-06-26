โอเคครับ ✨ ถ้าเราจะเจาะลึกเรื่อง next-server.ts ในโฟลเดอร์ mocks ผมขออธิบายให้เห็นภาพการใช้งานจริงแบบชัด ๆ  

การทำงานของ Mock ใน Next.js
- จำลอง API Routes: ใช้ไฟล์ mock เพื่อสร้าง endpoint ปลอม เช่น /api/users โดยไม่ต้องเชื่อมต่อฐานข้อมูลจริง  
- ทดสอบ SSR: จำลองการทำงานของ server-side rendering เพื่อดูว่า component แสดงผลถูกต้องหรือไม่  
- ควบคุมผลลัพธ์: กำหนด response เอง เช่นให้ส่ง JSON ที่เราต้องการกลับมา  

ตัวอย่างโค้ด next-server.ts สำหรับการทดสอบ
`ts
// mocks/next-server.ts
export const mockServer = {
  get: jest.fn((url) => {
    if (url === "/api/users") {
      return Promise.resolve({ data: [{ id: 1, name: "Mock User" }] });
    }
    return Promise.reject(new Error("Not Found"));
  }),
};
`
- ใช้ Jest เพื่อสร้างฟังก์ชันจำลอง  
- เวลาเขียนเทสต์ เราสามารถ import mockServer มาแทนการเรียก API จริง  

เชื่อมโยงกับ GitHub Workflow
- ใน CI/CD pipeline เราอาจรันเทสต์ที่ใช้ mock เพื่อให้แน่ใจว่าโค้ดทำงานได้แม้ไม่มีเซิร์ฟเวอร์จริง  
- ลดความเสี่ยงจากการพึ่งพา external API ที่อาจล่มหรือช้า  

คุณอยากให้ผมขยายต่อไปที่ วิธีเขียนเทสต์จริง ๆ ที่ใช้ mockServer, หรือ การตั้งค่า GitHub Actions ให้รันเทสต์กับ mock ดีครับ?