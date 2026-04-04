import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProducts } from '@/lib/product-queries';
import ProductGallery from '@/components/ui/ProductGallery';
import ProductCard from '@/components/ui/ProductCard';
import { getAllProducts as getAll } from '@/lib/product-queries';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found – Za Art' };
  return {
    title: `${product.name} – Za Art`,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Related: same category, different product
  const all = await getAll();
  const related = all
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-bark-500 mb-8 flex items-center gap-2">
        <a href="/" className="hover:text-wood-700">Home</a>
        <span>›</span>
        <a href="/products" className="hover:text-wood-700">Products</a>
        <span>›</span>
        <span className="text-wood-800 font-medium">{product.name}</span>
      </nav>

      <ProductGallery product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-heading mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
