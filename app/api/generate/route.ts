import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { auth } from '../../../lib/auth'
import { db } from '../../../lib/db'
import { agreements } from '../../../lib/db/schema'
import type { AgreementData } from '../../../app/agreement-data'

const RequestSchema = z.object({ chatText: z.string().trim().min(10).max(20000) })
const DataSchema = z.object({ title: z.string().trim().min(1).max(200), client_name: z.string().trim().min(1).max(200), deliverables: z.array(z.string().trim().min(1).max(500)).min(1).max(30), price: z.string().trim().min(1).max(100), deadline: z.string().trim().min(1).max(200), revisions_count: z.string().trim().min(1).max(100), out_of_scope: z.array(z.string().trim().min(1).max(500)).max(30) })
const prompt = `حلل النص التالي واستخرج JSON فقط بهذه المفاتيح: title, client_name, deliverables (array), price, deadline, revisions_count, out_of_scope (array). افهم العربية والدارجة والفرنسية.\nالنص:\n`

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً.' }, { status: 401 })
    const parsed = RequestSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'أرسل نصاً صالحاً.' }, { status: 400 })
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'خدمة Gemini غير مهيأة.' }, { status: 503 })
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt + parsed.data.chatText }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } }) })
    if (!response.ok) return NextResponse.json({ error: 'تعذر الاتصال بخدمة الإنشاء.' }, { status: 502 })
    const payload = await response.json()
    const raw = payload.candidates?.[0]?.content?.parts?.[0]?.text
    const data = DataSchema.parse(JSON.parse(raw))
    const id = crypto.randomUUID()
    await db.insert(agreements).values({ id, userId: session.user.id, title: data.title, clientName: data.client_name, deliverables: JSON.stringify(data.deliverables), price: data.price, deadline: data.deadline, revisionsCount: data.revisions_count, outOfScope: JSON.stringify(data.out_of_scope), status: 'pending', createdAt: new Date() })
    return NextResponse.json({ ...data, id, status: 'pending' } satisfies AgreementData)
  } catch (error) {
    console.error('[v0] generation error', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الاتفاق.' }, { status: 500 })
  }
}
