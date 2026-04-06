import dynamic from 'next/dynamic';

const ProductForm = dynamic(
  () => import('@/components/admin/ProductForm'),
  { ssr: false }
);

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-wood-900 mb-8">
        Add New Product
      </h1>
      <ProductForm />
    </div>
  );
}
