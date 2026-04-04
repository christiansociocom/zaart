import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/product-queries';
import ProductsClient from '@/components/ui/ProductsClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Products – Za Art',
  description: 'Browse all handcrafted wooden products from Za Art Tanzania.',
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="section-heading mb-2">Our Products</h1>
        <p className="text-bark-600 text-lg">
          Every piece is handmade in Tanzania with quality wood.
        </p>
      </div>
      <ProductsClient products={products} />
    </div>
  );
}
