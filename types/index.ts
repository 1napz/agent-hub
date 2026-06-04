// types/index.ts

export interface PluginParameter {
  type: string; // e.g., 'string', 'number', 'boolean'
  description: string;
  enum?: string[]; // ค่าที่เป็นไปได้ (ถ้ามี)
}

export interface PluginDefinition {
  id: string;
  name: string; // ชื่อฟังก์ชัน (เช่น get_weather)
  description: string; // คำอธิบายเพื่อให้ AI รู้ว่าเมื่อไหร่ควรใช้
  parameters: {
    type: 'object';
    properties: Record<string, PluginParameter>;
    required: string[];
  };
}

export interface PluginExecutionResult {
  success: boolean;
  data: any;
  error?: string;
}