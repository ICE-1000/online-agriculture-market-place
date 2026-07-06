'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Spinner from '@/components/Spinner';
import { ErrorNote } from '@/components/Spinner';

const TOGGLES = [
  { key: 'email_notifications', label: 'Email Notifications', hint: 'Order and listing updates by email' },
  { key: 'push_notifications', label: 'Push Notifications', hint: 'Alerts on this device' },
  { key: 'sms_notifications', label: 'SMS Notifications', hint: 'Text messages for important updates' },
  {
    key: 'price_predictions_enabled',
    label: 'Price Predictions',
    hint: 'Enable AI price trend estimates',
  },
];

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-pill transition ${on ? 'bg-primary' : 'bg-line'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

function NotificationsContent() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getNotifications()
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(key) {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSaving(true);
    try {
      const result = await api.updateNotifications({ [key]: updated[key] });
      setSettings((prev) => ({ ...prev, ...result }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell nav={false} width="narrow">
      <TopBar title="Notifications" />
      <div className="px-5 py-5">
        <ErrorNote message={error} />
        {loading || !settings ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : (
          <div className="divide-y divide-line rounded-card bg-surface shadow-card">
            {TOGGLES.map((item) => (
              <div key={item.key} className="flex items-center justify-between px-4 py-4">
                <span>
                  <span className="block text-[14px] font-semibold text-ink">{item.label}</span>
                  <span className="block text-[12px] text-muted">{item.hint}</span>
                </span>
                <Toggle on={!!settings[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        )}
        {saving && <p className="mt-3 text-center text-[12px] text-muted">Saving…</p>}
      </div>
    </AppShell>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
