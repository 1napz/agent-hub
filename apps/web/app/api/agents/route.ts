import { NextResponse } from 'next/server'
export async function GET(){ return NextResponse.json({agents:['pure','crystalcastle','claude']}) }

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for writes
)

const WORKSHIFT_API_URL = 'https://api.workshift.com/v1/shifts' // Replace with real endpoint
const WORKSHIFT_API_KEY = process.env.WORKSHIFT_API_KEY!
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const force = searchParams.get('force') === 'true'

  try {
    // Step 1: Check cache first unless force refresh
    if (!force) {
      const { data: cached } = await supabase
       .from('workshift_cache')
       .select('*')
       .order('updated_at', { ascending: false })
      
      if (cached && cached.length > 0) {
        const cacheAge = Date.now() - new Date(cached[0].updated_at).getTime()
        if (cacheAge < CACHE_DURATION_MS) {
          return NextResponse.json({ 
            source: 'cache', 
            data: cached.map(c => c.data),
            cached_at: cached[0].updated_at
          })
        }
      }
    }

    // Step 2: Fetch fresh from WorkShift
    const res = await fetch(WORKSHIFT_API_URL, {
      headers: {
        'Authorization': `Bearer ${WORKSHIFT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      // Important: disable Next.js fetch cache here since we handle our own
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error(`WorkShift API error: ${res.status} ${res.statusText}`)
    }

    const freshData = await res.json()
    const shifts = freshData.shifts || freshData.data || freshData // adapt to WorkShift's shape

    // Step 3: Upsert to Supabase
    const rows = shifts.map((shift: any) => ({
      id: shift.id.toString(), // ensure it's text
      data: shift
    }))

    const { error: upsertError } = await supabase
     .from('workshift_cache')
     .upsert(rows, { onConflict: 'id' })

    if (upsertError) throw upsertError

    return NextResponse.json({ 
      source: 'api', 
      data: shifts,
      cached_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    
    // Fallback: return stale cache if API fails
    const { data: stale } = await supabase
     .from('workshift_cache')
     .select('data')
      
    if (stale && stale.length > 0) {
      return NextResponse.json({ 
        source: 'stale-cache', 
        data: stale.map(s => s.data),
        error: error.message 
      }, { status: 200 }) // Still 200 so UI doesn't break
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}