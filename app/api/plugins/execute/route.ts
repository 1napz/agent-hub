import { NextRequest, NextResponse } from 'next/server';
import { executePlugin } from '@/core/plugins/registry';
// Import plugins ทั้งหมดที่นี่ หรือทำ auto-import ใน registry
import '@/core/plugins/weather-plugin'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plugin_name, arguments: args } = body;

    if (!plugin_name || !args) {
      return NextResponse.json({ error: 'Missing plugin_name or arguments' }, { status: 400 });
    }

    const result = await executePlugin(plugin_name, args);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}