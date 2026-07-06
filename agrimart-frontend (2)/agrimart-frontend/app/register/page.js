'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { Field, TextInput, Select } from '@/components/Fields';
import { ErrorNote } from '@/components/Spinner';
import AppShell from '@/components/AppShell';
import { PROVINCES } from '@/lib/categories';

const ROLES = [
  { value: 'consumer', label: 'Buyer / Consumer', icon: '🧺' },
  { value: 'farmer', label: 'Farmer / Supplier', icon: '🏪' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    role: 'consumer',
    username: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    province: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Registration successful. Please log in.');
      setTimeout(() => router.replace('/login'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell nav={false} width="narrow">
      <div className="px-6 pb-10 pt-10 md:px-0">
        <h1 className="text-center text-[24px] font-extrabold text-ink">Create Account</h1>
        <p className="mt-1 text-center text-[14px] text-muted">Join AgriMart today</p>

        <ErrorNote message={error} />
        {success && (
          <div className="mb-4 rounded-2xl bg-primary-light px-4 py-3 text-[13px] font-medium text-primary">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <Field label="I am a...">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  type="button"
                  key={role.value}
                  onClick={() => update('role', role.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 ${
                    form.role === role.value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-transparent bg-surface text-ink'
                  }`}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <span className="text-[13px] font-semibold">{role.label}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Username" required hint="Letters and numbers only, 3–30 characters. You'll use this to log in.">
            <TextInput
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              required
            />
          </Field>

          <Field label="Full Name" required>
            <TextInput
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </Field>

          <Field label="Email" hint="Optional">
            <TextInput
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </Field>

          <Field label="Phone Number" required hint="10–15 digits, e.g. 0971234567">
            <TextInput
              placeholder="0971234567"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
            />
          </Field>

          <Field label="Location">
            <TextInput
              placeholder="e.g. Lusaka, Chongwe, Kafue"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
            />
          </Field>

          <Field label="Province">
            <Select value={form.province} onChange={(e) => update('province', e.target.value)}>
              <option value="">Select province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Password" required hint="At least 6 characters">
            <TextInput
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
            />
          </Field>

          <Field label="Confirm Password" required>
            <TextInput
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              required
            />
          </Field>

          <Button type="submit" loading={loading} className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-[14px] text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary">
            Log In
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
