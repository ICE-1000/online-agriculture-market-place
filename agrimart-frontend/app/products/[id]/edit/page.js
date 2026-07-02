'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CATEGORIES, UNITS, AVAILABILITY } from '@/lib/categories';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Button from '@/components/Button';
import { Field, TextInput, TextArea } from '@/components/Fields';
import { ErrorNote } from '@/components/Spinner';
import Spinner from '@/components/Spinner';

function EditProductContent() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getProduct(id)
      .then((p) =>
        setForm({
          name: p.name,
          categoryId: p.categoryId,
          price: p.price,
          quantity: p.quantity,
          unit: p.unit,
          availability: p.availability,
          description: p.description || '',
          imageUrl: p.imageUrl,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('categoryId', form.categoryId);
      fd.append('price', form.price);
      fd.append('quantity', form.quantity);
      fd.append('unit', form.unit);
      fd.append('availability', form.availability);
      fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      await api.updateProduct(id, fd);
      router.replace(`/products/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <AppShell nav={false}>
        <TopBar title="Edit Product" />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell nav={false}>
      <TopBar title="Edit Product" />
      <form onSubmit={handleSubmit} className="px-5 py-5">
        <ErrorNote message={error} />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-6 flex h-40 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-muted/40 bg-transparent"
        >
          {imagePreview || form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview || form.imageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <span className="text-2xl text-muted">📷</span>
              <span className="text-[14px] font-semibold text-muted">Add Product Photo</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          className="hidden"
          onChange={onPickImage}
        />

        <Field label="Product Name">
          <TextInput value={form.name} onChange={(e) => update('name', e.target.value)} />
        </Field>

        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => update('categoryId', cat.id)}
                className={`flex items-center gap-1.5 rounded-pill px-4 py-2 text-[13px] font-semibold ${
                  form.categoryId === cat.id ? 'bg-primary text-white' : 'bg-surface text-ink'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (ZMW)">
            <TextInput
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
            />
          </Field>
          <Field label="Quantity">
            <TextInput
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Unit">
          <div className="flex flex-wrap gap-2">
            {UNITS.map((unit) => (
              <button
                type="button"
                key={unit}
                onClick={() => update('unit', unit)}
                className={`rounded-pill px-4 py-2 text-[13px] font-semibold ${
                  form.unit === unit ? 'bg-primary text-white' : 'bg-surface text-ink'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Status">
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY.map((status) => (
              <button
                type="button"
                key={status.value}
                onClick={() => update('availability', status.value)}
                className={`rounded-pill px-4 py-2 text-[13px] font-semibold ${
                  form.availability === status.value
                    ? 'bg-primary text-white'
                    : 'bg-surface text-ink'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </Field>

        <Button type="submit" loading={saving} className="mt-2">
          Save Changes
        </Button>
      </form>
    </AppShell>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductContent />
    </ProtectedRoute>
  );
}
