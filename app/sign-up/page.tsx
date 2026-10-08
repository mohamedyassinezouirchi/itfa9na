'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setError(''); const result = await authClient.signUp.email({ name, email, password }); if (result.error) setError('Impossible de créer le compte. Vérifiez vos informations.'); else { router.push('/create'); router.refresh() } setBusy(false) }
  return <main className="flex min-h-screen items-center justify-center bg-[#081b2a] px-5 text-[#f4f0e8]"><form onSubmit={submit} className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-white/15 bg-white/[0.07] p-8 backdrop-blur-xl"><h1 className="text-3xl font-semibold">Créer votre compte</h1><p className="text-white/60">Commencez à créer des accords clairs.</p><input required value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none" /><input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe (8 caractères minimum)" className="rounded-xl border border-white/15 bg-white/10 p-3 outline-none" />{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button disabled={busy} className="rounded-xl bg-[#b9e7df] px-5 py-3 font-bold text-[#081b2a] disabled:opacity-60">{busy ? 'Création…' : 'Créer mon compte'}</button><a href="/sign-in" className="text-center text-sm text-[#8ce1d4]">J&apos;ai déjà un compte</a></form></main>
}
