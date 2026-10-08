'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpLeft, FileCheck2, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { AgreementData } from '../agreement-data'
import { authClient } from '../../lib/auth-client'
import { useLanguage } from '../../lib/language'
import { LanguageToggle } from '../../components/language-toggle'

export default function CreatePage() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isFrench } = useLanguage()
  const copy = isFrench
    ? { subtitle: 'Un espace de travail plus clair', example: 'Voir un exemple', badge: 'Des accords clairs, sans malentendu', title: 'Transformez vos échanges', accent: 'en accord confirmé.', description: 'Collez votre conversation ou le texte de l’accord. Nous le structurons dans une carte simple à relire et à confirmer.', placeholder: 'Collez ici votre conversation WhatsApp ou le texte de l’accord…', hint: 'Aucun formatage nécessaire', submit: 'Créer la carte de l’accord', loading: 'Création de la carte…', empty: 'Collez d’abord une conversation ou un résumé.', failure: 'Échec de la demande', missing: 'L’accord n’a pas pu être créé', unexpected: 'Une erreur inattendue est survenue', footer: 'Parce que la clarté protège les deux parties' }
    : { subtitle: 'مساحة عمل أوضح', example: 'شاهد مثالاً', badge: 'اتفاقات أوضح، بدون سوء فهم', title: 'حوّل كلام الواتساب', accent: 'إلى اتفاق موثّق.', description: 'الصق محادثتك أو أضف نص الاتفاق، وسنرتّبه لك في بطاقة بسيطة يراجعها عميلك ويؤكدها.', placeholder: 'الصق هنا محادثة الواتساب أو نص الاتفاق…', hint: 'لا تحتاج إلى تنسيق النص', submit: 'أنشئ بطاقة الاتفاق', loading: 'جارٍ إنشاء البطاقة', empty: 'الصق محادثة أو ملخص الاتفاق أولاً', failure: 'فشل الطلب', missing: 'لم يتم إنشاء الاتفاق', unexpected: 'حدث خطأ غير متوقع', footer: 'لأن الوضوح يحمي الطرفين' }

  useEffect(() => {
    if (!sessionPending && !session) router.replace('/sign-in')
  }, [sessionPending, session, router])

  async function handleSubmit() {
    if (!text.trim()) { setError(copy.empty); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chatText: text }) })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || err.message || `${copy.failure} (${res.status})`) }
      const data: AgreementData = await res.json()
      if (!data?.id) throw new Error(copy.missing)
      router.push(`/agreement/${data.id}`)
    } catch (err) { setLoading(false); setError(err instanceof Error ? err.message : copy.unexpected) }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#081b2a] px-5 py-5 text-[#f4f0e8] sm:px-10 sm:py-8">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:radial-gradient(circle_at_15%_15%,#1aa7b840,transparent_30%),radial-gradient(circle_at_90%_80%,#e0b76522,transparent_28%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#b9e7df] text-[#081b2a] shadow-[0_0_24px_#71e1d055]"><FileCheck2 className="size-5" /></div>
            <div><p className="text-lg font-semibold tracking-tight">اتفقنا<span className="text-[#8ce1d4]">.</span></p><p className="text-[11px] uppercase tracking-[0.2em] text-white/45">{copy.subtitle}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button onClick={() => router.push('/agreement/demo')} className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/65 transition hover:border-white/40 hover:text-white sm:flex">{copy.example} {isFrench ? <ArrowUpLeft className="size-3.5" /> : <ArrowLeft className="size-3.5" />}</button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8ce1d4]/25 bg-[#8ce1d4]/10 px-3 py-1.5 text-xs font-medium text-[#aeece3]"><Sparkles className="size-3.5" /> {copy.badge}</div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#d4b56d]">01 / {isFrench ? 'STRUCTURER' : 'ترتيب'}</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-7xl">{copy.title}<br /><span className="text-[#8ce1d4] sm:text-[60px]">{copy.accent}</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">{copy.description}</p>
            <div className="mt-10 flex items-center gap-6 text-xs text-white/45"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#8ce1d4]" /> {isFrench ? 'Simple' : 'بسيط'}</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#d4b56d]" /> {isFrench ? 'Lisible' : 'واضح'}</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#e58b83]" /> {isFrench ? 'Confirmé' : 'موثّق'}</span></div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.45rem] border border-white/10 bg-[#f4f0e8] p-3 text-[#102c3a]">
              <div className="flex items-center justify-between px-3 pb-3 pt-1"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#557078]">{isFrench ? 'NOUVEL ACCORD' : 'اتفاق جديد'}</span><span className="size-2 rounded-full bg-[#62cfc0]" /></div>
              <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={copy.placeholder} className="min-h-56 w-full resize-none rounded-2xl border border-[#d7dfd9] bg-white/70 p-5 text-base leading-8 text-[#102c3a] outline-none placeholder:text-[#8da0a0] focus:border-[#62cfc0] focus:ring-4 focus:ring-[#62cfc0]/15" dir={isFrench ? 'ltr' : 'rtl'} />
              {error && <div className="mx-2 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">{error}</div>}
              <div className="flex items-center justify-between gap-3 px-2 pt-3"><p className="hidden text-xs text-[#789096] sm:block">{copy.hint}</p><button onClick={handleSubmit} disabled={loading} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b3445] px-5 text-sm font-bold text-white shadow-lg shadow-[#0b3445]/20 transition hover:bg-[#164c60] disabled:opacity-70 sm:flex-none sm:min-w-52">{loading ? <><Loader2 className="size-4 animate-spin" /> {copy.loading}</> : <>{copy.submit} {isFrench ? <ArrowUpLeft className="size-4" /> : <ArrowLeft className="size-4" />}</>}</button></div>
            </div>
          </div>
        </section>
        <footer className="flex justify-between border-t border-white/10 pt-4 text-[11px] tracking-wide text-white/35"><span>ATFAQNA / 2026</span><span>{copy.footer}</span></footer>
      </div>
    </main>
  )
}
