import { NextResponse } from 'next/server';
import { getAllPlugins } from '@/core/plugins/registry';
import '@/core/plugins/weather-plugin'; // Import เพื่อ trigger การ register

export async function GET() {
  const plugins = getAllPlugins();
  return NextResponse.json(plugins);
}