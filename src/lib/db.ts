// ─── Database types & helpers ────────────────────────────────────────────────
// All products are now stored in Supabase instead of the static array.

export type Category =
  | 'trays'
  | 'kitchen-dining'
  | 'storage-organizers'
  | 'furniture'
  | 'decor';

export interface PriceVariant {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  price_variants: PriceVariant[] | null;
  description: string;
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'trays',              label: 'Trays',                icon: '🪵' },
  { id: 'kitchen-dining',     label: 'Kitchen & Dining',     icon: '🍽️' },
  { id: 'storage-organizers', label: 'Storage & Organizers', icon: '📦' },
  { id: 'furniture',          label: 'Furniture',            icon: '🪑' },
  { id: 'decor',              label: 'Decor',                icon: '🌿' },
];

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '255700000000';

export function buildWhatsAppLink(
  productName: string,
  price: number | string
): string {
  const priceStr =
    typeof price === 'number' ? price.toLocaleString() : price;
  const msg = encodeURIComponent(
    `Habari Za Art!\nNingependa kuagiza:\n*${productName}* – Tshs ${priceStr}\n\nInapatikana?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export function generalWhatsAppLink(message?: string): string {
  const msg = encodeURIComponent(
    message || `Habari Za Art!\nNina swali kuhusu bidhaa zenu.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
