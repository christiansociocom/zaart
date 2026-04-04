import { createSupabaseAnonClient } from './supabase-server';
import type { Product, Category } from './db';

export async function getAllProducts(): Promise<Product[]> {
  const sb = createSupabaseAnonClient();
  const { data, error } = await sb
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const sb = createSupabaseAnonClient();
  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) throw error;
  return data as Product[];
}

/** Homepage grid: featured items first, then newest — so uploads show even if not starred. */
export async function getHomepageProducts(limit = 8): Promise<Product[]> {
  const sb = createSupabaseAnonClient();
  const { data, error } = await sb
    .from('products')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = createSupabaseAnonClient();
  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getProductsByCategory(cat: Category): Promise<Product[]> {
  const sb = createSupabaseAnonClient();
  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('category', cat)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Product[];
}
