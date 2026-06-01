import { NextResponse } from 'next/server'
/**
 * Provide a JSON response with the list of available agent identifiers.
 *
 * @returns A JSON object with an `agents` property containing the array `['pure', 'crystalcastle', 'claude']`
 */
export async function GET(){ return NextResponse.json({agents:['pure','crystalcastle','claude']}) }