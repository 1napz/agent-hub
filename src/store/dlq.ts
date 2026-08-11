// src/store/dlq.ts (หรือเพิ่มใน KPI Store)
export const useDLQStore = create<DLQState>((set, get) => ({
  items: [],
  
  // ฟังก์ชันลบไฟล์แบบ Optimistic
  deleteItemOptimistically: async (id: string) => {
    const previousItems = get().items; // 1. เก็บสถานะเดิมไว้เผื่อต้อง Rollback
    const pushToast = useToastStore.getState().push;

    // 2. อัปเดต UI ทันที (ลบออกาก List และลดจำนวน DLQ ใน KPI)
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      await Api.deleteDLQ(id); // 3. ส่งคำขอไปที่ Apps Script [2]
      pushToast({ message: "ลบรายการสำเร็จ", type: "success" });
    } catch (error) {
      // 4. หาก Error ให้ Rollback กลับไปใช้ข้อมูลเดิม [3]
      set({ items: previousItems });
      pushToast({ message: "เกิดข้อผิดพลาด: " + error.message, type: "error" });
    }
  },
}));

