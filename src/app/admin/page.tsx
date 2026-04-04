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
        <Link href="/admin/products/new" className="btn-primary px-6 py-3 text-sm">
          + Add New Product
        </Link>
      </div>

      {/* Stats */}
      {/* Replace /icons/stat-*.png with your own stat icons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Products', value: products.length, icon: '/icons/stat-products.png' },
          { label: 'Featured',        value: featured,          icon: '/icons/stat-featured.png' },
          { label: 'Categories',      value: CATEGORIES.length, icon: '/icons/stat-categories.png' },
          { label: 'In Catalog',      value: products.length,   icon: '/icons/stat-catalog.png' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="w-10 h-10 mx-auto mb-1 relative">
              <Image src={s.icon} alt={s.label} fill className="object-contain" />
            </div>
            <div className="text-3xl font-bold text-wood-800">{s.value}</div>
            <div className="text-xs text-bark-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {CATEGORIES.map(c => (
          <div key={c.id} className="card p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-1 relative">
              <Image src={c.icon} alt={c.label} fill className="object-contain" />
            </div>
            <div className="text-xl font-bold text-wood-800">{categoryCounts[c.id]}</div>
            <div className="text-xs text-bark-500">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-wood-50 text-bark-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price (Tshs)</th>
              <th className="px-4 py-3 text-left">Featured</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-bark-400">
                  No products yet. <Link href="/admin/products/new" className="text-wood-600 underline">Add your first product →</Link>
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="hover:bg-wood-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-wood-900">{p.name}</td>
                  <td className="px-4 py-3 text-bark-600 capitalize">
                    {p.category.replace(/-/g, ' ')}
                  </td>
                  <td className="px-4 py-3">{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-wood-600 hover:text-wood-800 font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="text-bark-400 hover:text-bark-600 hover:underline"
                      >
                        View ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
