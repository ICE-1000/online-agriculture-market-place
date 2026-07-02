'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Button from '@/components/Button';
import { Field, TextInput, Select } from '@/components/Fields';
import { ErrorNote } from '@/components/Spinner';
import { PROVINCES } from '@/lib/categories';

function ManageLocationContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState(user.location || '');
  const [province, setProvince] = useState(user.province || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.updateLocation({ location, province });
      await refreshUser();
      setSuccess('Location updated.');
      setTimeout(() => router.replace('/settings'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell nav={false}>
      <TopBar title="Manage Location" />
      <form onSubmit={handleSubmit} className="px-5 py-5">
        <ErrorNote message={error} />
        {success && (
          <div className="mb-4 rounded-2xl bg-primary-light px-4 py-3 text-[13px] font-medium text-primary">
            {success}
          </div>
        )}

        <Field label="Location">
          <TextInput
            placeholder="e.g. Chongwe, Kafue"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
        <Field label="Province">
          <Select value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="">Select province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Button type="submit" loading={loading} className="mt-2">
          Save Location
        </Button>
      </form>
    </AppShell>
  );
}

export default function ManageLocationPage() {
  return (
    <ProtectedRoute>
      <ManageLocationContent />
    </ProtectedRoute>
  );
}
