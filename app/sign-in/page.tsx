'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/language'
import { LanguageToggle } from '@/components/language-toggle'

export default function SignInPage() {
  const router = useRouter(); const { isFrench } = useLanguage(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setError(''); const result = await authClient.signIn.email({ email, password }); if (result.error) setError(isFrench ? 'Email ou mot de passe incorrect.' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'); else { router.push('/create'); router.refresh() } setBusy(false) }
  const copy = isFrench ? { title: 'Se connecter', description: 'Retrouvez vos accords en toute sécurité.', password: 'Mot de passe', submit: 'Se connecter', busy: 'Connexion…', signUp: 'Créer un compte' } : { title: 'تسجيل الدخول', description: 'اعثر على اتفاقاتك بأمان.', password: 'كلمة المرور', submit: 'تسجيل الدخول', busy: 'جارٍ تسجيل الدخول…', signUp: 'إنشاء حساب' }
  return <main className="flex min-h-screen items-center justify-center bg-[#081b2a] px-5 text-[#f4f0e8]"><form onSubmit={submit} className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-white/15 bg-white/[0.07] p-8 backdrop-blur-xl"><div className="flex justify-end"><LanguageToggle /></div><h1 className="text-3xl font-semibold">{copy.title}</h1><p className="text-white/60">{copy.description}</p><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" aria-label="Email" className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none" /><input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={copy.password} aria-label={copy.password} className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none" />{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button disabled={busy} className="rounded-xl bg-[#b9e7df] px-5 py-3 font-bold text-[#081b2a] disabled:opacity-60">{busy ? copy.busy : copy.submit}</button><a href="/sign-up" className="text-center text-sm text-[#8ce1d4]">{copy.signUp}</a></form></main>
}
