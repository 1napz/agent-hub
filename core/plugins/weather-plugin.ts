// core/plugins/weather-plugin.ts
import { registerPlugin } from './registry';
import { PluginDefinition, PluginExecutionResult } from '@/types';

// 1. นิยามโครงสร้าง (ให้ AI อ่าน)
const weatherPluginDef: PluginDefinition = {
  id: 'plugin_weather_01',
  name: 'get_weather',
  description: 'Get the current weather in a given location. Use this when the user asks about the weather.',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city name, e.g., Bangkok, Tokyo',
      },
      unit: {
        type: 'string',
        description: 'The temperature unit',
        enum: ['celsius', 'fahrenheit'],
      }
    },
    required: ['location'],
  },
};

// 2. ฟังก์ชันทำงานจริง (ไปเรียก API ภายนอก)
async function executeWeather(args: { location: string; unit?: string }): Promise<PluginExecutionResult> {
  // จำลองการเรียก API จริง (เช่น OpenWeatherMap)
  const mockTemp = args.unit === 'fahrenheit' ? 86 : 30;
  
  return {
    success: true,
    data: {
      location: args.location,
      temperature: mockTemp,
      unit: args.unit || 'celsius',
      condition: 'Sunny',
      fetchedAt: new Date().toISOString()
    }
  };
}

// 3. ลงทะเบียนปลั๊กอิน
registerPlugin(weatherPluginDef, executeWeather);