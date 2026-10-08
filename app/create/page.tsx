'use client'

import { useState } from 'react'
import { ArrowLeft, FileCheck2, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { AgreementData } from '../agreement-data'

export default function CreatePage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!text.trim()) {
      setError('الصق محادثة أو ملخص الاتفاق أولاً')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatText: text }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || err.message || `فشل الطلب (${res.status})`)
      }
      const data: AgreementData = await res.json()
      if (!data || !data.id) throw new Error('لم يتم إنشاء الاتفاق')
      router.push(`/agreement/${data.id}`)
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-5 py-6 text-[#18352c] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#174b3b] text-white shadow-sm"><FileCheck2 /></div>
            <div><p className="text-lg font-bold tracking-tight">اتفقنا</p><p className="text-xs text-[#708179]">مساحة عمل أوضح</p></div>
          </div>
          <button onClick={() => router.push('/agreement/demo')} className="flex items-center gap-1 text-sm text-[#708179] transition hover:text-[#174b3b]">شاهد مثالاً <ArrowLeft className="size-4" /></button>
        </header>

        <section className="flex flex-1 flex-col justify-center py-14">
          <div className="mb-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e5efe9] px-3 py-1.5 text-xs font-medium text-[#28604d]"><Sparkles className="size-3.5" /> اتفاقات أوضح، بدون سوء فهم</div>
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl">حوّل كلام الواتساب<br /><span className="text-[#4e8b70]">إلى اتفاق موثّق.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-[#708179]">الصق محادثتك أو أضف نص الاتفاق، وسنرتّبه لك في بطاقة بسيطة يراجعها عميلك ويؤكدها.</p>
          </div>
          <div className="rounded-3xl border border-[#dce6df] bg-white p-3 shadow-[0_20px_60px_rgba(24,53,44,0.08)]">
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="الصق هنا محادثة الواتساب أو نص الاتفاق..." className="min-h-52 w-full resize-none rounded-2xl bg-[#f8faf8] p-5 text-base leading-8 text-[#18352c] outline-none placeholder:text-[#a2b0aa] focus:ring-2 focus:ring-[#b7d7c5]" dir="rtl" />
            {error && <div className="mx-2 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">{error}</div>}
            <div className="flex items-center justify-between gap-3 px-2 pt-3">
              <p className="hidden text-xs text-[#9aa9a1] sm:block">لا تحتاج إلى تنسيق النص</p>
              <button onClick={handleSubmit} disabled={loading} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#174b3b] px-5 text-sm font-bold text-white transition hover:bg-[#28604d] disabled:opacity-70 sm:flex-none sm:min-w-52">{loading ? <><Loader2 className="size-4 animate-spin" /> جارٍ إنشاء البطاقة</> : <>أنشئ بطاقة الاتفاق <ArrowLeft className="size-4" /></>}</button>
            </div>
          </div>
        </section>
        <footer className="flex justify-center pb-2 text-xs text-[#9aa9a1]">اتفقنا — لأن الوضوح يحمي الطرفين</footer>
      </div>
    </main>
  )
}
