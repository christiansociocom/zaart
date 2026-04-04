import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/product-queries';
import { CATEGORIES } from '@/lib/db';

export const revalidate = 0;

export default async function AdminDashboard() {
  const products = await getAllProducts();
  const featured = products.filter(p => p.featured).length;

  const categoryCounts: Record<string, number> = {};
  for (const c of CATEGORIES) {
    categoryCounts[c.id] = products.filter(p => p.category === c.id).length;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-3xl font-bold text-wood-900">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary px-6 py-3 text-sm">+ Add New Product</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Products', value: products.length, icon: '📦' },
          { label: 'Featured',        value: featured,          icon: '⭐' },
          { label: 'Categories',      value: CATEGORIES.length, icon: '🗂️' },
          { label: 'In Catalog',      value: products.length,   icon: '📋' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl mb-1" aria-hidden="true">{s.icon}</div>
            <div className="text-3xl font-bold text-wood-800">{s.value}</div>
            <div className="text-xs text-bark-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {CATEGORIES.map(c => (
          <div key={c.id} className="card p-4 text-center">
            <div className="text-2xl mb-1" aria-hidden="true">{c.icon}</div>
            <div className="text-xl font-bold text-wood-800">{categoryCounts[c.id]}</div>
            <div className="text-xs text-bark-500">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-wood-900 mb-6">Your Products</h2>
        {products.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-bark-500 text-lg mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="btn-primary px-6 py-3 inline-block">Add your first product →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Badge */}
                {p.featured && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold z-10">⭐ Featured</div>
                )}

                {/* Product Image */}
                <div className="relative w-full h-48 bg-wood-50">
                  {p.images && p.images.length > 0 ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-wood-300 text-4xl">📸</div>
                  )}
                  {p.images && p.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">+{p.images.length - 1} more</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-wood-900 text-lg mb-1">{p.name}</h3>
                  
                  {/* Category */}
                  <p className="text-bark-600 text-xs capitalize mb-2">
                    {CATEGORIES.find(c => c.id === p.category)?.icon} {p.category.replace(/-/g, ' ')}
                  </p>

                  {/* Description */}
                  <p className="text-bark-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                    {p.description || 'No description'}
                  </p>

                  {/* Price & Variants */}
                  <div className="mb-3 pb-3 border-b border-sand">
                    <p className="font-bold text-wood-900 text-lg">
                      Tshs {p.price.toLocaleString()}
                    </p>
                    {p.price_variants && p.price_variants.length > 0 && (
                      <p className="text-xs text-bark-500">
                        {p.price_variants.length} size variant{p.price_variants.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex-1 text-center bg-wood-600 hover:bg-wood-700 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="flex-1 text-center border-2 border-wood-600 text-wood-600 hover:bg-wood-50 font-medium py-2 rounded-lg text-sm transition-colors"
                    >
                      👁️ View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}