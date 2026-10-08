import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { AgreementData } from '../../../app/agreement-data'

const GenerateRequestSchema = z.object({
  chatText: z.string().min(1, 'chatText is required'),
})

const AgreementDataSchema = z.object({
  title: z.string(),
  client_name: z.string(),
  deliverables: z.array(z.string()),
  price: z.string(),
  deadline: z.string(),
  revisions_count: z.string(),
  out_of_scope: z.array(z.string()),
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

const SYSTEM_PROMPT = `أنت خبير في تحليل المحادثات باللغة العربية والدارجة المغربية والعامية واستخراج بيانات الاتفاقيات.

المطلوب: قم بتحليل المحادثة التالية واستخرج البيانات التالية بتنسيق JSON صالح فقط بدون أي نص إضافي:

{
  "title": "عنوان الاتفاق",
  "client_name": "اسم العميل",
  "deliverables": ["المستلم الأول", "المستلم الثاني"],
  "price": "السعر مع العملة",
  "deadline": "الموعد النهائي",
  "revisions_count": "عدد جولات التعديلات",
  "out_of_scope": ["البند الأول خارج النطاق"]
}

قواعد مهمة:
1. أعد فقط JSON صالح بدون أي شرح.
2. للأرقام والأسعار، استخدم الأرقام العربية (٠١٢٣٤٥٦٧٨٩) عند الإمكان.
3. افهم السياق حتى لو كانت الكلمات بالدارجة المغربية أو العامية.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = GenerateRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }
    const { chatText } = parsed.data

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey: openaiApiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `المحادثة:\n\n${chatText}\n\nأخرج بيانات الاتفاق بصيغة JSON فقط.` },
      ],
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 502 })
    }

    let extractedData: unknown
    try {
      extractedData = JSON.parse(responseContent)
    } catch {
      return NextResponse.json({ error: 'Failed to parse JSON from OpenAI', raw: responseContent }, { status: 502 })
    }

    const validated = AgreementDataSchema.safeParse(extractedData)
    if (!validated.success) {
      return NextResponse.json({ error: 'OpenAI response mismatch schema', details: validated.error.flatten(), raw: extractedData }, { status: 502 })
    }

    const supabase = createServerSupabase()

    const agreementRecord = { ...validated.data, status: 'pending' }

    const { data: inserted, error: supabaseError } = await supabase
      .from('agreements')
      .insert(agreementRecord)
      .select('id')
      .single()

    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError)
      return NextResponse.json({ error: 'Failed to save agreement', details: supabaseError.message }, { status: 500 })
    }

    if (!inserted) {
      return NextResponse.json({ error: 'No record returned after insert' }, { status: 500 })
    }

    const result: AgreementData = { ...validated.data, id: inserted.id, status: 'pending' }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
