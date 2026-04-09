'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import DebugInfo from '@/components/DebugInfo';

const ProductForm = dynamic(
  () => import('@/components/admin/ProductForm'),
  { ssr: false, loading: () => <div className="p-8 text-center">⏳ Loading product form...</div> }
);

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-wood-900 mb-8">
        Add New Product
      </h1>
      <DebugInfo />
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <ProductForm />
      </Suspense>
    </div>
  );
}
