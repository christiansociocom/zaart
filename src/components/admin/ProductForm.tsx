'use client';
import { useState } from 'react';
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

  function handleNameChange(v: string) {
    setName(v);
    if (!isEdit) setSlug(slugify(v));
  }

  function addVariant() { setVariants([...variants, { label: '', price: 0 }]); }
  function removeVariant(i: number) { setVariants(variants.filter((_, idx) => idx !== i)); }
  function updateVariant(i: number, key: keyof PriceVariant, value: string) {
    setVariants(variants.map((v, idx) =>
      idx === i ? { ...v, [key]: key === 'price' ? Number(value) : value } : v
    ));
  }

  async function handleSave() {
    try {
      setError('');
      if (!name || !slug || !price) { setError('Name, slug, and price are required.'); return; }
      if (images.length === 0) { setError('Please upload at least one product image.'); return; }
      setSaving(true);

      const imagesArray = Array.isArray(images) && images.length > 0
        ? images.filter(img => img && img.trim() && img.startsWith('http'))
        : [];

      if (imagesArray.length === 0) {
        setSaving(false);
        setError('No valid product images found. Please re-upload images.');
        return;
      }

      const payload = {
        name, slug, category,
        price: Number(price),
        description,
        featured,
        images: imagesArray,
        price_variants: variants.length > 0 ? variants : null,
        updated_at: new Date().toISOString(),
      };

      const { error: err } = isEdit
        ? await supabase.from('products').update(payload).eq('id', product!.id)
        : await supabase.from('products').insert({ ...payload, created_at: new Date().toISOString() });

      setSaving(false);
      if (err) { setError(err.message); return; }
      await fetch('/api/revalidate', { method: 'POST' });
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setSaving(false);
      setError('JS Error: ' + (err?.message || String(err)));
    }
  }

  async function handleDelete() {
    try {
      if (!confirm('Delete this product? This cannot be undone.')) return;
      setDeleting(true);
      const { error: delErr } = await supabase.from('products').delete().eq('id', product!.id);
      setDeleting(false);
      if (delErr) { setError(delErr.message); return; }
      await fetch('/api/revalidate', { method: 'POST' });
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setDeleting(false);
      setError('JS Error: ' + (err?.message || String(err)));
    }
  }

  return (
    <div className="max-w-3xl">
      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">{error}</div>}

      <div className="space-y-6">
        {/* Name */}
        <Field label="Product Name *">
          <input className="input" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Round Serving Tray" />
        </Field>

        {/* Slug */}
        <Field label="URL Slug *" hint="Used in the URL: /products/your-slug">
          <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="round-serving-tray" />
        </Field>

        {/* Category */}
        <Field label="Category *">
          <select className="input" value={category} onChange={e => setCategory(e.target.value as Category)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </Field>

        {/* Price */}
        <Field label="Base Price (Tshs) *">
          <input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="35000" />
        </Field>

        {/* Variants */}
        <Field label="Price Variants (optional)" hint="Add sizes or options with different prices">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="input flex-1" placeholder="Label e.g. Small – 30cm" value={v.label}
                onChange={e => updateVariant(i, 'label', e.target.value)} />
              <input className="input w-32" type="number" placeholder="Price" value={v.price}
                onChange={e => updateVariant(i, 'price', e.target.value)} />
              <button onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 px-2">✕</button>
            </div>
          ))}
          <button onClick={addVariant} className="btn-outline text-sm px-4 py-2 mt-1">+ Add Variant</button>
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea className="input min-h-[120px] resize-y" value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the product simply and clearly..." />
        </Field>

        {/* Images */}
        <Field label="Images *" hint={`Upload product photos via Cloudinary (${images.length} uploaded)`}>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-sand bg-wood-50">
                {img ? (
                  <>
                    <Image src={img} alt={`Product ${i}`} fill className="object-cover" />
                    <button
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center transition"
                    >✕</button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">⏳</div>
                )}
              </div>
            ))}
          </div>

          <CldUploadWidget
            uploadPreset="zaart_products"
            signatureEndpoint="/api/cloudinary-signature"
            onSuccess={(result: any) => {
              try {
                const url = result?.info?.secure_url;
                if (url && typeof url === 'string' && url.startsWith('http')) {
                  setImages(prev => [...prev, url]);
                  setUploadingIndex(null);
                } else {
                  setError('Invalid image URL received. Please try again.');
                }
              } catch (err) {
                setError('Error processing uploaded image.');
              }
            }}
            onError={(error: any) => {
              setError(`Upload failed: ${error?.message || 'Unknown error'}. Check your Cloudinary configuration.`);
              setUploadingIndex(null);
            }}
            onOpen={() => { setUploadingIndex(images.length); }}
            onClose={() => { setUploadingIndex(null); }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={uploadingIndex !== null}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-50"
              >
                {uploadingIndex !== null ? '⏳ Uploading...' : '📷 Upload Image'}
              </button>
            )}
          </CldUploadWidget>

          {images.length === 0 && (
            <p className="text-red-500 text-sm mt-2">⚠️ At least one image is required</p>
          )}
        </Field>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)}
            className="w-5 h-5 accent-wood-600 rounded" />
          <span className="font-semibold text-wood-800">Show on homepage as Featured Product</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button onClick={handleSave} disabled={saving || images.length === 0} className="btn-primary px-8 py-4 disabled:opacity-60">
            {saving ? 'Saving…' : isEdit ? '💾 Save Changes' : '✅ Create Product'}
          </button>
          <button onClick={() => router.back()} className="btn-outline px-6 py-4">Cancel</button>
          {isEdit && (
            <button onClick={handleDelete} disabled={deleting}
              className="ml-auto px-6 py-4 rounded-2xl border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-all disabled:opacity-60">
              {deleting ? 'Deleting…' : '🗑 Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-semibold text-wood-800 mb-1">{label}</label>
      {hint && <p className="text-xs text-bark-500 mb-2">{hint}</p>}
      {children}
    </div>
  );
}
