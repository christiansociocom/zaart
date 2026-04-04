'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/db';
import type { Product, Category } from '@/lib/db';
import ProductCard from '@/components/ui/ProductCard';

interface Props {
  products: Product[];
}

export default function ProductsClient({ products }: Props) {
  const [active, setActive] = useState<Category | 'all'>('all');

  const filtered =
    active === 'all' ? products : products.filter(p => p.category === active);

  const counts: Record<string, number> = { all: products.length };
  for (const c of CATEGORIES) {
    counts[c.id] = products.filter(p => p.category === c.id).length;
  }

  return (
    <>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 md:flex-wrap md:overflow-visible md:mx-0 md:px-0">
        <button
          onClick={() => setActive('all')}
          className={`shrink-0 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all border-2 ${
            active === 'all'
              ? 'bg-wood-700 text-white border-wood-700 shadow'
              : 'border-wood-200 text-wood-700 hover:border-wood-500'
          }`}
        >
          All Products ({counts.all})
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all border-2 flex items-center gap-1.5 ${
              active === c.id
                ? 'bg-wood-700 text-white border-wood-700 shadow'
                : 'border-wood-200 text-wood-700 hover:border-wood-500'
            }`}
          >
          <span className="text-base" aria-hidden="true">{c.icon}</span>
            {c.label} ({counts[c.id] ?? 0})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-bark-500">
          {/* Replace /icons/empty-wood.png with your own empty-state illustration */}
          <div className="w-16 h-16 mx-auto mb-3 relative">
            <Image src="/icons/empty-wood.png" alt="No products" fill className="object-contain" />
          </div>
          <p className="text-lg font-medium">No products in this category yet.</p>
          <p className="text-sm">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
