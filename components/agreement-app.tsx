'use client'

import { useState } from 'react'
import { ArrowLeft, Check, CheckCircle2, ClipboardCheck, Clock3, FileText, Loader2, MessageCircle, Pencil, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export interface AgreementData {
  id?: string
  title: string
  client_name: string
  deliverables: string[]
  price: string
  deadline: string
  revisions_count: string
  out_of_scope: string[]
  status?: 'pending' | 'confirmed'
  confirmed_at?: string
}

const sampleAgreement: AgreementData = {
  id: 'demo-1',
  title: 'تصميم الهوية البصرية',
  client_name: 'سارة أحمد',
  deliverables: ['شعار رئيسي ونسخ متعددة', 'لوحة ألوان وخطوط', 'دليل استخدام مختصر للهوية'],
  price: '٣٬٥٠٠ ر.س',
  deadline: '١٥ مايو ٢٠٢٤',
  revisions_count: 'جولتان من التعديلات',
  out_of_scope: ['تصميم المطبوعات', 'إدارة حسابات التواصل الاجتماعي'],
  status: 'pending',
}

export function BrandMark() {
  return <div className="brand-mark" aria-hidden="true"><ClipboardCheck className="size-5" strokeWidth={2.5} /></div>
}

export function AppHeader({ back = false }: { back?: boolean }) {
  return (
    <header className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-8">
      <Link href="/create" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
        <BrandMark />
        <div className="leading-tight">
          <div className="font-display text-lg font-bold tracking-tight text-foreground">اتفقنا</div>
          <div className="text-[10px] font-medium text-muted-foreground">وضوح يبدأ من الاتفاق</div>
        </div>
      </Link>
      {back && <Link href="/create" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" /> اتفاق جديد</Link>}
    </header>
  )
}

export function CreateView() {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!text.trim()) { setError('الصق محادثة أو ملخص الاتفاق أولاً'); return }
    setError('')
    setIsLoading(true)
    window.setTimeout(() => { window.location.href = '/agreement/demo-1' }, 700)
  }

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-16 pt-12 sm:px-8 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20 lg:pt-20">
        <section className="mb-12 lg:mb-0">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary"><Sparkles className="size-3.5" /> طريقة أذكى للتوثيق</div>
          <h1 className="font-display max-w-xl text-4xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-6xl">خلّ الاتفاق <span className="text-primary">واضحاً</span> من البداية.</h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">حوّل كلام الواتساب المتناثر إلى بطاقة اتفاق مرتبة، يفهمها الجميع ويؤكدونها بثقة.</p>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> تحفظ حقوق الطرفين</span><span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" /> خلال ثوانٍ</span></div>
        </section>

        <section className="paper-card p-5 sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="font-display text-xl font-bold">أنشئ بطاقة اتفاق</h2><p className="mt-1 text-sm text-muted-foreground">الصق محادثتك وسنرتب التفاصيل لك.</p></div><div className="rounded-2xl bg-secondary p-3 text-primary"><MessageCircle className="size-5" /></div></div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="conversation" className="text-sm font-semibold">محادثة الواتساب أو ملخص الاتفاق</label>
            <textarea id="conversation" value={text} onChange={(event) => setText(event.target.value)} placeholder="مثال: أهلاً سارة، اتفقنا على تصميم الهوية..." className="min-h-52 w-full resize-y rounded-2xl border border-input bg-background px-4 py-4 text-sm leading-7 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" />
            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}
            <Button type="submit" disabled={isLoading} className="mt-1 h-12 rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90">{isLoading ? <><Loader2 className="size-4 animate-spin" /> جاري إنشاء البطاقة...</> : <>أنشئ بطاقة الاتفاق <ArrowLeft className="size-4" /></>}</Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">لن نشارك محادثتك مع أي طرف آخر.</p>
        </section>
      </div>
    </main>
  )
}

export function AgreementCard({ data, onConfirm, onRequestEdit }: { data: AgreementData; onConfirm?: () => void; onRequestEdit?: () => void }) {
  const confirmed = data.status === 'confirmed'
  return <article className="paper-card overflow-hidden">
    <div className="border-b border-border/70 bg-secondary/45 px-5 py-5 sm:px-8 sm:py-7">
      <div className="mb-5 flex items-center justify-between gap-4"><span className={confirmed ? 'status-badge status-confirmed' : 'status-badge'}><span className="size-1.5 rounded-full bg-current" />{confirmed ? 'تم التأكيد' : 'بانتظار التأكيد'}</span><span className="text-xs font-medium text-muted-foreground">بطاقة اتفاق #{data.id ?? '—'}</span></div>
      <h1 className="font-display text-2xl font-bold leading-snug sm:text-3xl">{data.title}</h1><p className="mt-2 text-sm text-muted-foreground">مع <span className="font-semibold text-foreground">{data.client_name}</span></p>
    </div>
    <div className="flex flex-col gap-7 p-5 sm:p-8">
      <section><h2 className="section-label">يشمل الاتفاق</h2><ul className="mt-4 flex flex-col gap-3">{data.deliverables.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="size-3.5" strokeWidth={3} /></span>{item}</li>)}</ul></section>
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border"><div className="border-l border-border bg-secondary/35 p-4"><p className="section-label">القيمة</p><p className="mt-2 font-display text-lg font-bold">{data.price}</p></div><div className="p-4"><p className="section-label">موعد التسليم</p><p className="mt-2 font-display text-lg font-bold">{data.deadline}</p></div></div>
      <div className="flex items-center justify-between border-b border-border pb-6"><span className="section-label">التعديلات المتاحة</span><span className="text-sm font-semibold">{data.revisions_count}</span></div>
      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><div className="flex items-center gap-2 text-sm font-bold text-amber-900"><Pencil className="size-4" /> خارج نطاق الاتفاق</div><ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-amber-900/75">{data.out_of_scope.map((item) => <li key={item} className="before:ml-2 before:content-['•']">{item}</li>)}</ul></section>
      {confirmed && <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary"><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><div><p className="font-bold">تم تأكيد الاتفاق بنجاح</p><p className="mt-1 text-primary/75">{data.confirmed_at}</p></div></div>}
      {!confirmed && <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><Button onClick={onConfirm} className="h-12 rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90">أؤكد الاتفاق <Check className="size-4" /></Button><Button onClick={onRequestEdit} variant="outline" className="h-12 rounded-xl border-border px-6 text-sm font-semibold">طلب تعديل</Button></div>}
    </div>
  </article>
}

export function AgreementView() {
  const [data, setData] = useState(sampleAgreement)
  const [notice, setNotice] = useState('')
  function confirm() { setData((current) => ({ ...current, status: 'confirmed', confirmed_at: 'تم التأكيد الآن' })); setNotice('تم حفظ تأكيدك') }
  function requestEdit() { setNotice('سيتواصل معك صاحب الاتفاق لمراجعة التعديلات') }
  return <main className="min-h-screen bg-background" dir="rtl"><AppHeader back /><div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12"><div className="mb-7 text-center"><div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FileText className="size-6" /></div><p className="text-sm font-semibold text-primary">مراجعة الاتفاق</p><h2 className="mt-2 font-display text-2xl font-bold">تأكد أن كل التفاصيل واضحة لك</h2></div><AgreementCard data={data} onConfirm={confirm} onRequestEdit={requestEdit} />{notice && <p className="mt-5 text-center text-sm font-medium text-muted-foreground" role="status">{notice}</p>}</div></main>
}

export { sampleAgreement }

export function CreatePage() { return <CreateView /> }
export function AgreementPage() { return <AgreementView /> }
