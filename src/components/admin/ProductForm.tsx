
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/db';
import type { Product, PriceVariant, Category } from '@/lib/db';

interface Props { product?: Product; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [category, setCategory] = useState<Category>(product?.category ?? 'trays');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [description, setDescription] = useState(product?.description ?? '');
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [variants, setVariants] = useState<PriceVariant[]>(product?.price_variants ?? []);

  // ✅ DEBUG LOGS
  useEffect(() => {
    console.log('✅ ProductForm mounted');
    console.log('Cloudinary loaded:', !!(window as any).cloudinary);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  }, []);

  function handleNameChange(v: string) {
    setName(v);
    if (!isEdit) setSlug(slugify(v));
  }

  function addVariant() {
    setVariants([...variants, { label: '', price: 0 }]);
  }

  function removeVariant(i: number) {
    setVariants(variants.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, key: keyof PriceVariant, value: string) {
    setVariants(variants.map((v, idx) =>
      idx === i ? { ...v, [key]: key === 'price' ? Number(value) : value } : v
    ));
  }

  async function handleSave() {
    try {
      setError('');

      if (!name || !slug || !price) {
        setError('Name, slug, and price are required.');
        return;
      }

      if (images.length === 0) {
        setError('Please upload at least one product image.');
        return;
      }

      setSaving(true);

      const imagesArray = images.filter(img => img && img.startsWith('http'));

      if (imagesArray.length === 0) {
        setSaving(false);
        setError('No valid product images found.');
        return;
      }

      const payload = {
        name,
        slug,
        category,
        price: Number(price),
        description,
        featured,
        images: imagesArray,
        price_variants: variants.length > 0 ? variants : null,
        updated_at: new Date().toISOString(),
      };

      console.log('📦 Saving product:', payload);

      const { error: err } = isEdit
        ? await supabase.from('products').update(payload).eq('id', product!.id)
        : await supabase.from('products').insert({
            ...payload,
            created_at: new Date().toISOString()
          });

      setSaving(false);

      if (err) {
        console.error('❌ Supabase error:', err);
        setError(err.message);
        return;
      }

      console.log('✅ Product saved successfully');

      await fetch('/api/revalidate', { method: 'POST' });

      router.push('/admin');
      router.refresh();

    } catch (err: any) {
      console.error('❌ JS Error:', err);
      setSaving(false);
      setError('JS Error: ' + (err?.message || String(err)));
    }
  }

  async function handleDelete() {
    try {
      if (!confirm('Delete this product? This cannot be undone.')) return;

      setDeleting(true);

      const { error: delErr } = await supabase
        .from('products')
        .delete()
        .eq('id', product!.id);

      setDeleting(false);

      if (delErr) {
        setError(delErr.message);
        return;
      }

      console.log('🗑 Product deleted');

      await fetch('/api/revalidate', { method: 'POST' });

      router.push('/admin');
      router.refresh();

    } catch (err: any) {
      console.error('❌ Delete error:', err);
      setDeleting(false);
      setError('JS Error: ' + (err?.message || String(err)));
    }
  }

  return (
    <div className="max-w-3xl">

      {/* ✅ DEBUG PANEL */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 bg-blue-50 border border-blue-300 rounded p-3 text-xs">
          <div className="font-bold">DEBUG INFO:</div>
          <div>Cloudinary: {!!(window as any)?.cloudinary ? '✅' : '❌'}</div>
          <div>
            Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 20)}...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">

        <Field label="Product Name *">
          <input className="input" value={name} onChange={e => handleNameChange(e.target.value)} />
        </Field>

        <Field label="URL Slug *">
          <input className="input" value={slug} onChange={e => setSlug(e.target.value)} />
        </Field>

        <Field label="Category *">
          <select className="input" value={category} onChange={e => setCategory(e.target.value as Category)}>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Base Price (Tshs) *">
          <input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </Field>

        <Field label="Price Variants">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="input flex-1" value={v.label}
                onChange={e => updateVariant(i, 'label', e.target.value)} />
              <input className="input w-32" type="number" value={v.price}
                onChange={e => updateVariant(i, 'price', e.target.value)} />
              <button onClick={() => removeVariant(i)} className="text-red-500 px-2">✕</button>
            </div>
          ))}
          <button onClick={addVariant} className="btn-outline px-4 py-2">+ Add Variant</button>
        </Field>

        <Field label="Description">
          <textarea className="input" value={description}
            onChange={e => setDescription(e.target.value)} />
        </Field>

        <Field label="Images *">
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <Image src={img} alt="" fill className="object-cover rounded" />
                <button
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                >✕</button>
              </div>
            ))}
          </div>

          <CldUploadWidget
            uploadPreset="zaart_products"
            signatureEndpoint="/api/cloudinary-signature"
            onSuccess={(result: any) => {
              const url = result?.info?.secure_url;
              if (url) setImages(prev => [...prev, url]);
            }}
          >
            {({ open }) => (
              <button onClick={() => open()} className="btn-outline px-4 py-2">
                📷 Upload Image
              </button>
            )}
          </CldUploadWidget>
        </Field>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
          Featured Product
        </label>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-3">
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button onClick={() => router.back()} className="btn-outline px-6 py-3">
            Cancel
          </button>

          {isEdit && (
            <button onClick={handleDelete} className="ml-auto text-red-600">
              Delete
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function Field({ label, hint, children }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      {hint && <p className="text-xs mb-2">{hint}</p>}
      {children}
    </div>
  );
}

