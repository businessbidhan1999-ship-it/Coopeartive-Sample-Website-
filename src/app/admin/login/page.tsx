'use client';
import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brand } from '@/components/layout/Brand';
import { ArrowLeft, ArrowRight } from 'lucide-react';
function LoginForm() {
  const router = useRouter(),
    params = useSearchParams();
  const [error, setError] = useState(''),
    [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to sign in. Please try again.');
      const from = params.get('from');
      router.push(from && /^\/admin(?:\/|$)/.test(from) ? from : '/admin');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Check your connection and try again.');
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit}>
      <div className="form-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          maxLength={64}
          disabled={pending}
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          disabled={pending}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
export default function LoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <Brand />
        <h1>A familiar place to manage things.</h1>
        <p>Sign in to update the Mero Sahakari demo.</p>
        <Suspense fallback={<p>Loading sign-in form…</p>}>
          <LoginForm />
        </Suspense>
        <Link className="text-link" href="/">
          <ArrowLeft size={16} />
          Back to the website
        </Link>
      </div>
    </main>
  );
}
