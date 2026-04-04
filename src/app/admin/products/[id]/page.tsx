import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from('products').select('*').eq('id', params.id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-wood-900 mb-8">Edit Product</h1>
      <ProductForm product={data} />
    </div>
  );
}