'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CATEGORIES, UNITS, PROVINCES } from '@/lib/categories';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import Button from '@/components/Button';
import { Field, TextInput, TextArea, Select } from '@/components/Fields';
import { ErrorNote } from '@/components/Spinner';

function AddProductContent() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    categoryId: 'grains',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    location: user.location || '',
    province: user.province || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('categoryId', form.categoryId);
      fd.append('price', form.price);
      fd.append('quantity', form.quantity);
      fd.append('unit', form.unit);
      fd.append('description', form.description);
      fd.append('location', form.location);
      fd.append('province', form.province);
      fd.append('availability', 'available');
      if (imageFile) fd.append('image', imageFile);

      const product = await api.createProduct(fd);
      router.replace(`/products/${product.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell nav={false}>
      <TopBar title="Add Product" />
      <form onSubmit={handleSubmit} className="px-5 py-5">
        <ErrorNote message={error} />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-6 flex h-40 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-muted/40 bg-transparent"
        >
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <>
              <span className="text-2xl text-muted">📷</span>
              <span className="text-[14px] font-semibold text-muted">Add Product Photo</span>
              <span className="text-[12px] text-muted/70">Tap to upload</span>
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

        <Field label="Product Name" required>
          <TextInput
            placeholder="e.g. White Maize, Tomatoes"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </Field>

        <Field label="Category" required>
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
          <Field label="Price (ZMW)" required>
            <TextInput
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              required
            />
          </Field>
          <Field label="Quantity" required>
            <TextInput
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="Unit" required>
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

        <Field label="Description">
          <TextArea
            placeholder="Describe your product..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </Field>

        <Field label="Location">
          <TextInput
            placeholder="e.g. Chongwe"
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

        <Button type="submit" loading={loading} className="mt-2">
          List Product
        </Button>
      </form>
    </AppShell>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProductContent />
    </ProtectedRoute>
  );
}
