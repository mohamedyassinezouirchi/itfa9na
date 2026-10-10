'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, FileCheck2, Gauge, Menu, MessageCircle, ShieldCheck, Sparkles, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { LanguageToggle } from '@/components/language-toggle'

const steps = [
  ['01', 'الصق محادثتك', 'أرسل نص الاتفاق كما هو من واتساب.'],
  ['02', 'دع الذكاء يرتبها', 'نستخرج السعر، التسليم، التعديلات وكل التفاصيل.'],
  ['03', 'أرسل رابط التأكيد', 'العميل يراجع ويؤكد، وتحصل على سجل واضح.'],
]

const features = [
  { icon: ShieldCheck, title: 'حراسة نطاق العمل', copy: 'يكشف الطلبات الإضافية ويمنع التوسع المجاني قبل أن يتحول إلى مشكلة.' },
  { icon: Zap, title: 'تأكيد بضغطة زر', copy: 'عميلك يؤكد الاتفاق مباشرة من الرابط، بلا تطبيقات أو حسابات معقدة.' },
  { icon: MessageCircle, title: 'يفهم الدارجة والعامية', copy: 'ذكاء اصطناعي يفهم أسلوب كلامك الحقيقي، من الرسائل السريعة إلى التفاصيل.' },
]

export default function Page() {
  const [demo, setDemo] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#071b25] text-[#f2f7f5] selection:bg-[#8fe5d5]/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(80,181,173,.16),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(37,111,124,.17),transparent_32%)]" />
      <header className="relative z-20 border-b border-white/8 bg-[#071b25]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="اتفقنا"><span className="flex size-10 items-center justify-center rounded-xl bg-[#a6e8dc] text-xl font-black text-[#09232a]">ا</span><span className="text-xl font-bold">اتفقنا</span></Link>
          <nav className="hidden items-center gap-8 text-sm text-[#a4babd] md:flex"><a href="#how">كيف يعمل؟</a><a href="#features">الميزات</a><a href="#pricing">الأسعار</a></nav>
          <div className="hidden items-center gap-3 md:flex"><LanguageToggle /><Link href="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-[#c2d2d2]">تسجيل الدخول</Link><Link href="/sign-up" className="rounded-full bg-[#a6e8dc] px-5 py-2.5 text-sm font-bold text-[#09232a]">أنشئ حساب مجاني</Link></div>
          <button className="rounded-lg p-2 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="فتح القائمة">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && <div className="flex flex-col gap-4 border-t border-white/8 px-5 py-5 text-sm text-[#c2d2d2] md:hidden"><a href="#how">كيف يعمل؟</a><a href="#features">الميزات</a><a href="#pricing">الأسعار</a><div className="flex items-center gap-3"><LanguageToggle /><Link href="/sign-in">تسجيل الدخول</Link></div></div>}
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28"><div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-20"><motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8fe5d5]/25 px-4 py-2 text-xs font-semibold text-[#a6e8dc]"><Sparkles className="size-3.5" /> الاتفاق واضح، والشغل أهدأ</div><h1 className="max-w-3xl text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-[4.25rem]">لا حرج بعد اليوم.. <span className="text-[#9ce7d9]">حوّل اتفاقات الواتساب</span> إلى بطاقات مؤكدة بضغطة زر</h1><p className="mt-7 max-w-2xl text-base leading-8 text-[#a9bec1] sm:text-lg">احمِ وقتك ومالك. الذكاء الاصطناعي يستخرج بنود عملك، والعميل يؤكد بضغطة واحدة دون الحاجة لتسجيل حساب.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={() => { setDemo(true); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a6e8dc] px-6 py-3.5 font-bold text-[#09232a]">جرب الآن بدون حساب <ArrowLeft className="size-4" /></button><Link href="/sign-up" className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 font-semibold">إنشاء حساب مستقل</Link></div></motion.div><motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="relative"><div className="relative rounded-[2rem] border border-white/12 bg-[#102d39]/90 p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between border-b border-white/8 pb-4 text-sm font-semibold"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#8fe5d5]" /> بطاقة اتفاق ذكية</span><span className="text-xs text-[#80999c]">قبل دقيقة</span></div><div className="rounded-2xl bg-[#071e29] p-4"><p className="text-sm font-semibold">أنت</p><p className="mt-3 rounded-2xl rounded-tr-sm bg-[#1c4d56] p-3 text-sm leading-7">تصميم هوية بصرية كاملة مع 3 تعديلات، التسليم يوم الخميس بمبلغ 2,500 درهم.</p></div><div className="my-4 flex justify-center"><span className="rounded-full border border-[#8fe5d5]/20 px-3 py-1 text-xs text-[#a6e8dc]">تم استخراج الاتفاق</span></div><div className="rounded-2xl border border-[#8fe5d5]/20 bg-[#14343d] p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-[#91abad]">اتفاق تصميم الهوية</p><p className="mt-1 text-lg font-bold">2,500 درهم</p></div><span className="rounded-full bg-[#8fe5d5]/15 px-3 py-1 text-xs font-semibold text-[#9ce7d9]">{demo ? 'مؤكد' : 'بانتظار التأكيد'}</span></div></div></div></motion.div></div></section>

      <section id="how" className="border-y border-white/7 bg-[#0a232d]/70 px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold text-[#8fe5d5]">كيف يعمل؟</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">من رسالة مبعثرة إلى اتفاق يحميك</h2><div className="mt-12 grid gap-5 md:grid-cols-3">{steps.map(([number, title, copy]) => <div key={number} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><span className="text-sm font-bold text-[#8fe5d5]">{number}</span><h3 className="mt-8 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#9bb2b4]">{copy}</p></div>)}</div></div></section>

      <section id="demo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="mb-12 text-center"><p className="text-sm font-bold text-[#8fe5d5]">جرب بنفسك</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">شاهد الاتفاق يتشكل أمامك</h2></div><div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#102d39] p-5"><div className="mb-4 flex items-center gap-2 text-sm font-bold"><MessageCircle className="size-4 text-[#8fe5d5]" /> نص المحادثة</div><p className="rounded-xl bg-[#071e29] p-4 text-sm leading-8 text-[#c0d2d2]">السلام عليكم، بغيت لوجو جديد للمحل مع نسخة للسوشيال. الميزانية 1,800 درهم والتسليم نهاية الأسبوع، ويكون عندي تعديلين.</p><button onClick={() => setDemo(true)} className="mt-5 w-full rounded-xl bg-[#173f48] py-3 text-sm font-bold text-[#a6e8dc]">{demo ? 'تم تحليل النص' : 'جرب بنص توضيحي'}</button></div><div className="rounded-2xl border border-[#8fe5d5]/20 bg-[#102d39] p-5"><div className="mb-4 flex items-center gap-2 text-sm font-bold"><FileCheck2 className="size-4 text-[#8fe5d5]" /> بطاقة الاتفاق</div><div className="flex flex-col gap-3 text-sm"><div className="flex justify-between border-b border-white/8 pb-3"><span className="text-[#8ba8aa]">الخدمة</span><strong>تصميم هوية وشعار</strong></div><div className="flex justify-between border-b border-white/8 pb-3"><span className="text-[#8ba8aa]">المبلغ</span><strong>1,800 درهم</strong></div><div className="flex justify-between"><span className="text-[#8ba8aa]">الحالة</span><span className="font-bold text-[#a6e8dc]">{demo ? 'مؤكد' : 'بانتظار التأكيد'}</span></div></div></div></div></section>

      <section id="features" className="border-t border-white/7 px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold text-[#8fe5d5]">مصمم لشغلك الحقيقي</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">راحة بال، في كل اتفاق</h2><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, copy }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><span className="flex size-11 items-center justify-center rounded-xl bg-[#8fe5d5]/10 text-[#8fe5d5]"><Icon className="size-5" /></span><h3 className="mt-7 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#9bb2b4]">{copy}</p></div>)}</div></div></section>

      <section id="pricing" className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-4xl rounded-3xl border border-[#8fe5d5]/20 bg-[#12343d] p-8 text-center sm:p-12"><Gauge className="mx-auto size-8 text-[#8fe5d5]" /><h2 className="mt-5 text-3xl font-bold">ابدأ مجاناً، وكبّر شغلك براحة</h2><p className="mx-auto mt-4 max-w-lg leading-8 text-[#aac0c0]">جرب إنشاء اتفاقاتك بدون بطاقة بنكية. الحساب المجاني يكفي لتبدأ اليوم.</p><Link href="/sign-up" className="mt-8 inline-flex rounded-xl bg-[#a6e8dc] px-7 py-3.5 font-bold text-[#09232a]">أنشئ حسابك المجاني <ArrowLeft className="mr-2 size-4" /></Link></div></section>

      <footer className="border-t border-white/8 px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-[#81999b] sm:flex-row"><div className="font-bold text-[#d5e5e2]">اتفقنا</div><div className="flex gap-5"><a href="#">الشروط</a><a href="#">الخصوصية</a><a href="#">دعم واتساب</a></div><span>© 2025 اتفقنا. كل الحقوق محفوظة.</span></div></footer>
    </main>
  )
}
