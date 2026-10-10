'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/language'
import { LanguageToggle } from '@/components/language-toggle'

export default function SignUpPage() {
  const router = useRouter()
  const { isFrench } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const copy = isFrench
    ? {
        title: 'Créer votre compte',
        description: 'Commencez à créer des accords clairs.',
        name: 'Nom complet',
        email: 'Adresse e-mail',
        password: 'Mot de passe (8 caractères minimum)',
        submit: 'Créer mon compte',
        submitting: 'Création…',
        signIn: 'J’ai déjà un compte',
        invalid: 'Veuillez remplir tous les champs et utiliser un mot de passe d’au moins 8 caractères.',
        failure: 'Impossible de créer le compte. Vérifiez vos informations ou utilisez une autre adresse e-mail.',
      }
    : {
        title: 'إنشاء حسابك',
        description: 'ابدأ بإنشاء اتفاقيات واضحة وآمنة.',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور (8 أحرف على الأقل)',
        submit: 'إنشاء حسابي',
        submitting: 'جارٍ إنشاء الحساب…',
        signIn: 'لدي حساب بالفعل',
        invalid: 'يرجى ملء جميع الحقول واستخدام كلمة مرور من 8 أحرف على الأقل.',
        failure: 'تعذر إنشاء الحساب. تحقق من معلوماتك أو استخدم بريدًا إلكترونيًا آخر.',
      }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    setError('')

    if (!cleanName || !cleanEmail || password.length < 8) {
      setError(copy.invalid)
      return
    }

    setBusy(true)
    try {
      const result = await authClient.signUp.email({ name: cleanName, email: cleanEmail, password })
      if (result.error) {
        setError(copy.failure)
        return
      }
      router.push('/create')
      router.refresh()
    } catch {
      setError(copy.failure)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#081b2a] px-5 text-[#f4f0e8]">
      <form onSubmit={submit} dir={isFrench ? 'ltr' : 'rtl'} className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-white/15 bg-white/[0.07] p-8 text-right backdrop-blur-xl">
        <div className="flex justify-start">
          <LanguageToggle />
        </div>
        <h1 className="text-3xl font-semibold">{copy.title}</h1>
        <p className="text-white/60">{copy.description}</p>
        <input required value={name} onChange={(event) => setName(event.target.value)} placeholder={copy.name} aria-label={copy.name} className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none placeholder:text-white/50" />
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={copy.email} aria-label={copy.email} className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none placeholder:text-white/50" />
        <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.password} aria-label={copy.password} className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none placeholder:text-white/50" />
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-xl bg-[#b9e7df] px-5 py-3 font-bold text-[#081b2a] disabled:opacity-60">{busy ? copy.submitting : copy.submit}</button>
        <a href="/sign-in" className="text-center text-sm text-[#8ce1d4]">{copy.signIn}</a>
      </form>
    </main>
  )
}
