'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';

const EXPECT = [
  {
    icon: '📊',
    title: 'Price Trend Charts',
    body: 'Visualize price trends for maize, tomatoes, and other crops over time.',
  },
  {
    icon: '✨',
    title: 'Future Price Estimates',
    body: 'Machine learning models will predict price changes based on seasons and supply.',
  },
  {
    icon: '📍',
    title: 'Location-Based Analysis',
    body: 'Prices may vary by region. Get predictions specific to your area.',
  },
  {
    icon: '⚠️',
    title: 'Estimates Only',
    body: 'Predictions are based on historical data and patterns. Actual prices may differ.',
  },
];

function PredictionsContent() {
  return (
    <AppShell nav={false}>
      <TopBar title="Price Predictions" />
      <div className="px-5 py-5">
        <div className="flex flex-col items-center rounded-card bg-surface px-6 py-10 text-center shadow-card">
          <span className="text-4xl text-primary">📈</span>
          <h2 className="mt-3 text-[19px] font-extrabold text-ink">Price Predictions</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            AI-powered price trend analysis for Zambian agricultural products.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-accent-bg px-4 py-1.5 text-[13px] font-bold text-accent">
            🚀 Coming Soon
          </span>
        </div>

        <h3 className="mb-3 mt-6 text-[16px] font-bold text-ink">What to Expect</h3>
        <div className="space-y-3">
          {EXPECT.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-card bg-surface p-4 shadow-card">
              <span className="text-xl text-primary">{item.icon}</span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{item.title}</p>
                <p className="text-[13px] text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default function PredictionsPage() {
  return (
    <ProtectedRoute>
      <PredictionsContent />
    </ProtectedRoute>
  );
}
