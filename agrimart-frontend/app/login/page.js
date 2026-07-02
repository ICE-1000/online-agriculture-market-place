'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { Field, TextInput } from '@/components/Fields';
import { ErrorNote } from '@/components/Spinner';
import AppShell from '@/components/AppShell';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      router.replace('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoUsername) {
    setUsername(demoUsername);
    setPassword('');
    setError('Demo account credentials pre-filled — enter the password to continue.');
  }

  return (
    <AppShell nav={false}>
      <div className="flex flex-col px-6 pb-10 pt-14">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-3xl">
            🌾
          </div>
          <h1 className="text-[26px] font-extrabold text-ink">AgriMart</h1>
          <p className="mt-1 text-[14px] text-muted">Zambia&rsquo;s Agricultural Marketplace</p>
        </div>

        <ErrorNote message={error} />

        <form onSubmit={handleSubmit}>
          <Field label="Username">
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          <Button type="submit" loading={loading} className="mt-2">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-[14px] text-muted">
          Don&rsquo;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary">
            Register
          </Link>
        </p>

        <div className="my-8 h-px bg-line" />

        <p className="mb-3 text-center text-[13px] font-medium text-muted">Quick Demo Access</p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => fillDemo('mwansa')}
            className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3.5 shadow-card"
          >
            <span className="flex items-center gap-3 text-left">
              <span className="text-xl">🏪</span>
              <span>
                <span className="block text-[14px] font-semibold text-ink">Login as Farmer</span>
                <span className="block text-[12px] text-muted">Mwansa Chanda · Chongwe</span>
              </span>
            </span>
            <span className="text-[13px] font-semibold text-primary">LOGIN →</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo('joseph')}
            className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3.5 shadow-card"
          >
            <span className="flex items-center gap-3 text-left">
              <span className="text-xl">🧺</span>
              <span>
                <span className="block text-[14px] font-semibold text-ink">Login as Buyer</span>
                <span className="block text-[12px] text-muted">Joseph Phiri · Lusaka CBD</span>
              </span>
            </span>
            <span className="text-[13px] font-semibold text-primary">LOGIN →</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
