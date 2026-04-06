import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST() {
  const sb = await createSupabaseServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  revalidatePath('/');
  revalidatePath('/products');
  return NextResponse.json({ revalidated: true });
}
