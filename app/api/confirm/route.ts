import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const ConfirmRequestSchema = z.object({
  agreementId: z.string().uuid('معرف الاتفاق غير صالح'),
})

function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
  const key = serviceKey || anonKey
  if (!key) throw new Error('No Supabase key available')
  return createClient(url, key)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = ConfirmRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'أرسل معرف اتفاق صالحاً.' }, { status: 400 })
    }
    const { agreementId } = parsed.data

    const supabase = createServerSupabase()

    const confirmedAt = new Date().toISOString()

    const { data: updated, error: supabaseError } = await supabase
      .from('agreements')
      .update({ status: 'confirmed', confirmed_at: confirmedAt })
      .eq('id', agreementId)
      .select('id, status, confirmed_at')
      .single()

    if (supabaseError) {
      console.error('Supabase update error:', supabaseError)
      return NextResponse.json({ error: 'تعذر تأكيد الاتفاق. حاول مرة أخرى.' }, { status: 503 })
    }

    if (!updated) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      id: updated.id,
      status: updated.status,
      confirmed_at: updated.confirmed_at,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'حدث خطأ غير متوقع. حاول مرة أخرى.' }, { status: 500 })
  }
}
