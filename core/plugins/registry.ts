// core/plugins/registry.ts
import { PluginDefinition, PluginExecutionResult } from '@/types';

// เก็บ Definition ของปลั๊กอิน (ใช้ส่งให้ AI)
export const pluginDefinitions: Map<string, PluginDefinition> = new Map();

// เก็บฟังก์ชันการทำงานจริงๆ (ใช้ execute เมื่อ AI สั่ง)
export const pluginExecutors: Map<string, (args: any) => Promise<PluginExecutionResult>> = new Map();

// ฟังก์ชันสำหรับลงทะเบียนปลั๊กอินใหม่
export function registerPlugin(
  definition: PluginDefinition, 
  executor: (args: any) => Promise<PluginExecutionResult>
) {
  pluginDefinitions.set(definition.name, definition);
  pluginExecutors.set(definition.name, executor);
  console.log(`✅ Plugin registered: ${definition.name}`);
}

// ฟังก์ชันสำหรับดึงปลั๊กอินทั้งหมด (เพื่อส่งให้ UI หรือ AI)
export function getAllPlugins(): PluginDefinition[] {
  return Array.from(pluginDefinitions.values());
}

// ฟังก์ชันสำหรับรันปลั๊กอิน
export async function executePlugin(name: string, args: any): Promise<PluginExecutionResult> {
  const executor = pluginExecutors.get(name);
  if (!executor) {
    return { success: false, data: null, error: `Plugin '${name}' not found.` };
  }
  
  try {
    return await executor(args);
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}