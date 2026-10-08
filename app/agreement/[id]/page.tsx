'use client'

import { useEffect, useState } from 'react'
import { Check, CheckCircle2, Clock3, FileCheck2, Pencil, ShieldCheck, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { sampleAgreement, type AgreementData } from '../../agreement-data'

export default function AgreementPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [agreement, setAgreement] = useState<AgreementData>({ ...sampleAgreement, id: params.id })
  const [loading, setLoading] = useState(params.id !== 'demo')
  const [fetchError, setFetchError] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState('')

  useEffect(() => {
    if (!params.id || params.id === 'demo') {
      setLoading(false)
      setAgreement({ ...sampleAgreement, id: 'demo' })
      return
    }
    let cancelled = false
    setLoading(true)
    setFetchError('')
    ;(async () => {
      try {
        const response = await fetch(`/api/agreement/${encodeURIComponent(params.id)}`)
        const result = await response.json().catch(() => ({}))
        if (cancelled) return
        if (!response.ok) throw new Error(result.error || 'حدث خطأ أثناء تحميل الاتفاق')
        setAgreement({
          id: result.id,
          title: result.title,
          client_name: result.client_name,
          deliverables: Array.isArray(result.deliverables) ? result.deliverables : [],
          price: result.price,
          deadline: result.deadline,
          revisions_count: result.revisions_count,
          out_of_scope: Array.isArray(result.out_of_scope) ? result.out_of_scope : [],
          status: result.status || 'pending',
          confirmed_at: result.confirmed_at ? new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(result.confirmed_at)) : undefined,
        })
      } catch (err) {
        if (cancelled) return
        setFetchError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الاتفاق')
        setAgreement({ ...sampleAgreement, id: params.id })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [params.id])

  async function confirmAgreement() {
    if (!params.id || params.id === 'demo') {
      setAgreement((current) => ({ ...current, status: 'confirmed', confirmed_at: new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) }))
      return
    }
    setConfirmError('')
    setConfirming(true)
    try {
      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreementId: params.id }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || err.message || `فشل الطلب (${res.status})`)
      }
      const result = await res.json()
      const formattedDate = result.confirmed_at
        ? new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(result.confirmed_at))
        : new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
      setAgreement((current) => ({ ...current, status: 'confirmed', confirmed_at: formattedDate }))
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'حدث خطأ أثناء تأكيد الاتفاق')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-6 text-[#18352c] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between"><button onClick={() => router.push('/create')} className="flex items-center gap-2 text-sm font-bold"><span className="flex size-9 items-center justify-center rounded-xl bg-[#174b3b] text-white"><FileCheck2 className="size-5" /></span>اتفقنا</button><span className="flex items-center gap-1.5 text-xs text-[#708179]"><ShieldCheck className="size-4 text-[#4e8b70]" /> اتفاق موثّق</span></header>
        {loading && <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#dce6df] bg-white p-4 text-sm text-[#52665b]"><Loader2 className="size-4 animate-spin" /><span>جارٍ تحميل بيانات الاتفاق...</span></div>}
        {!loading && fetchError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{fetchError}</div>}
        {agreement.status === 'confirmed' && <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#b7d7c5] bg-[#e5efe9] p-4 text-sm font-medium text-[#28604d]"><CheckCircle2 className="size-5" /><span>تم تأكيد الاتفاق في {agreement.confirmed_at}</span></div>}
        <section className="overflow-hidden rounded-[2rem] border border-[#dce6df] bg-white shadow-[0_20px_60px_rgba(24,53,44,0.08)]">
          <div className="border-b border-[#edf1ed] p-6 sm:p-9"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-medium text-[#9aa9a1]">بطاقة اتفاق · {agreement.id === 'demo' ? 'مثال' : 'للمراجعة'}</p><h1 className="text-3xl font-bold tracking-tight">{agreement.title}</h1></div><span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${agreement.status === 'confirmed' ? 'bg-[#e5efe9] text-[#28604d]' : 'bg-[#fff4d8] text-[#946d1e]'}`}>{agreement.status === 'confirmed' ? 'تم التأكيد' : 'بانتظار التأكيد'}</span></div><p className="text-sm text-[#708179]">العميل: <strong className="text-[#18352c]">{agreement.client_name}</strong></p></div>
          <div className="p-6 sm:p-9"><h2 className="mb-4 text-sm font-bold">ما سيتم تسليمه</h2><ul className="flex flex-col gap-3">{agreement.deliverables.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#52665b]"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e5efe9] text-[#4e8b70]"><Check className="size-3.5" /></span>{item}</li>)}</ul><div className="my-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#f2f7f3] p-4"><p className="mb-2 flex items-center gap-1.5 text-xs text-[#708179]"><span className="text-lg">ر.س</span> السعر</p><p className="font-bold">{agreement.price}</p></div><div className="rounded-2xl bg-[#f2f7f3] p-4"><p className="mb-2 flex items-center gap-1.5 text-xs text-[#708179]"><Clock3 className="size-4" /> الموعد النهائي</p><p className="font-bold">{agreement.deadline}</p></div></div><div className="mb-6 flex items-center justify-between border-b border-[#edf1ed] pb-6 text-sm"><span className="text-[#708179]">التعديلات المشمولة</span><strong>{agreement.revisions_count}</strong></div><div className="rounded-2xl border border-[#f0dfad] bg-[#fffaf0] p-4"><p className="mb-2 text-sm font-bold text-[#765a1c]">خارج نطاق الاتفاق</p><ul className="flex flex-col gap-1 text-sm leading-6 text-[#8f773f]">{agreement.out_of_scope.map((item) => <li key={item}>• {item}</li>)}</ul></div></div>
          {agreement.status !== 'confirmed' && <div className="flex flex-col gap-3 bg-[#fbfcfb] p-6 sm:flex-row sm:p-9"><button onClick={confirmAgreement} disabled={confirming} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2d7657] px-5 text-sm font-bold text-white transition hover:bg-[#28604d] disabled:opacity-70">{confirming ? <><Loader2 className="size-4 animate-spin" /> جارٍ التأكيد...</> : <><CheckCircle2 className="size-4" /> أؤكد الاتفاق</>}</button><button disabled={confirming} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#dce6df] bg-white px-5 text-sm font-bold text-[#52665b] transition hover:bg-[#f2f7f3] disabled:opacity-70"><Pencil className="size-4" /> طلب تعديل</button>{confirmError && <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">{confirmError}</div>}</div>}
        </section>
        <p className="mt-5 text-center text-xs text-[#9aa9a1]">راجع التفاصيل بعناية قبل التأكيد. يمكنك طلب تعديل في أي وقت.</p>
      </div>
    </main>
  )
}
