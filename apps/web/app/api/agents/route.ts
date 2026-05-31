import { NextResponse } from 'next/server'
export async function GET(){ return NextResponse.json({agents:['pure','crystalcastle','claude']}) }