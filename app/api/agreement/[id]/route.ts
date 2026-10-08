import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = createServerSupabase()

  if (!supabase) {
    return NextResponse.json({ error: 'Agreement storage is not configured' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('agreements')
    .select('id, title, client_name, deliverables, price, deadline, revisions_count, out_of_scope, status, confirmed_at')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Supabase agreement lookup error:', error)
    return NextResponse.json({ error: 'Failed to load agreement' }, { status: 500 })
  }

  if (!data) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
  return NextResponse.json(data)
}
