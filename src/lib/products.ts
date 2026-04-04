export type Category = 'trays' | 'kitchen-dining' | 'storage-organizers' | 'furniture' | 'decor';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  priceVariants?: { label: string; price: number }[];
  description: string;
  images: string[];
  featured?: boolean;
};

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'trays',               label: 'Trays',                icon: '🪵' },
  { id: 'kitchen-dining',      label: 'Kitchen & Dining',     icon: '🍽️' },
  { id: 'storage-organizers',  label: 'Storage & Organizers', icon: '📦' },
  { id: 'furniture',           label: 'Furniture',            icon: '🪑' },
  { id: 'decor',               label: 'Decor',                icon: '🌿' },
];

// ── Update this with your real WhatsApp number (country code, no +) ──
export const WHATSAPP_NUMBER = '255700000000';

export function buildWhatsAppLink(productName: string, price: number | string): string {
  const priceStr = typeof price === 'number' ? price.toLocaleString() : price;
  const msg = encodeURIComponent(
    `Habari Za Art! 👋\nNingependa kuagiza:\n*${productName}* – Tshs ${priceStr}\n\nInapatikana?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export function generalWhatsAppLink(message?: string): string {
  const msg = encodeURIComponent(
    message || `Habari Za Art! 👋\nNina swali kuhusu bidhaa zenu.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// ── Product catalogue ─────────────────────────────────────────────────────────
// Replace `images` arrays with your real Cloudinary or uploaded image URLs.
// Current images use Unsplash placeholders (warm/wood tones).

export const PRODUCTS: Product[] = [
  // ─ TRAYS ─────────────────────────────────────────────────────────────────
  {
    id: 'p1',
    slug: 'round-serving-tray',
    name: 'Round Serving Tray',
    category: 'trays',
    price: 35000,
    priceVariants: [
      { label: 'Small – 30 cm', price: 35000 },
      { label: 'Large – 40 cm', price: 50000 },
    ],
    description:
      'A hand-carved round tray made from solid natural wood. Great for serving drinks, fruits, or as a stylish centrepiece on your coffee table.',
    images: [
      'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'p2',
    slug: 'rectangular-breakfast-tray',
    name: 'Breakfast Tray with Handles',
    category: 'trays',
    price: 45000,
    priceVariants: [
      { label: 'Medium – 35×25 cm', price: 45000 },
      { label: 'Large – 45×30 cm',  price: 60000 },
    ],
    description:
      'A beautiful breakfast tray with side handles — perfect for serving breakfast in bed or as an ottoman tray in your living room.',
    images: [
      'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'p3',
    slug: 'decorative-tray-set',
    name: 'Decorative Tray Set – 3 Pieces',
    category: 'trays',
    price: 75000,
    description:
      'Three nesting oval trays in different sizes. Use them stacked or spread across your home for serving or decorating.',
    images: [
      'https://images.unsplash.com/photo-1601379327928-cb3c8e97d1e5?w=800&q=80',
    ],
    featured: false,
  },

  // ─ KITCHEN & DINING ──────────────────────────────────────────────────────
  {
    id: 'p4',
    slug: 'wooden-salad-bowl-set',
    name: 'Wooden Salad Bowl Set',
    category: 'kitchen-dining',
    price: 55000,
    description:
      'A large salad bowl with two serving spoons, all hand-carved from a single piece of acacia wood. Food-safe and easy to clean.',
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd4f9cd31e7?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'p5',
    slug: 'wooden-spoon-set',
    name: 'Wooden Spoon & Spatula Set',
    category: 'kitchen-dining',
    price: 28000,
    priceVariants: [
      { label: '3-Piece Set', price: 28000 },
      { label: '6-Piece Set', price: 50000 },
    ],
    description:
      'Handcrafted kitchen utensils made from dense, durable wood. Smooth finish — gentle on your cookware, beautiful on display.',
    images: [
      'https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&q=80',
    ],
    featured: false,
  },
  {
    id: 'p6',
    slug: 'cutting-board-handle',
    name: 'Cutting Board with Handle',
    category: 'kitchen-dining',
    price: 40000,
    priceVariants: [
      { label: 'Medium – 30×20 cm', price: 40000 },
      { label: 'Large – 40×25 cm',  price: 55000 },
    ],
    description:
      'A thick, sturdy board with an ergonomic handle. Double-sided — one side for chopping, one side for serving your charcuterie.',
    images: [
      'https://images.unsplash.com/photo-1587545276501-f5cfce5f5a9d?w=800&q=80',
    ],
    featured: true,
  },

  // ─ STORAGE & ORGANIZERS ──────────────────────────────────────────────────
  {
    id: 'p7',
    slug: 'desktop-organizer',
    name: 'Desktop Organizer',
    category: 'storage-organizers',
    price: 65000,
    description:
      'Keep your desk tidy with this multi-compartment wooden organizer. Slots for pens, a phone stand, and space for notes and small items.',
    images: [
      'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800&q=80',
    ],
    featured: false,
  },
  {
    id: 'p8',
    slug: 'wooden-storage-box',
    name: 'Storage Box with Lid',
    category: 'storage-organizers',
    price: 80000,
    priceVariants: [
      { label: 'Small – 20×15 cm', price: 80000 },
      { label: 'Large – 30×20 cm', price: 120000 },
    ],
    description:
      'A beautiful keepsake box with a fitted lid. Store jewellery, spices, or small treasured items. Can be personalised on request.',
    images: [
      'https://images.unsplash.com/photo-1509868918748-a554f2f5b8c8?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'p9',
    slug: 'wall-shelf',
    name: 'Floating Wall Shelf',
    category: 'storage-organizers',
    price: 95000,
    priceVariants: [
      { label: '60 cm',  price: 95000 },
      { label: '90 cm',  price: 130000 },
      { label: '120 cm', price: 160000 },
    ],
    description:
      'A solid wooden floating shelf that adds warmth and function to any wall. Comes with all mounting hardware included.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    ],
    featured: false,
  },

  // ─ FURNITURE ─────────────────────────────────────────────────────────────
  {
    id: 'p10',
    slug: 'coffee-table',
    name: 'Handcrafted Coffee Table',
    category: 'furniture',
    price: 450000,
    description:
      'A stunning low coffee table made from solid reclaimed wood with natural grain patterns. Each piece is unique — no two tables look the same.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'p11',
    slug: 'bedside-table',
    name: 'Bedside Table',
    category: 'furniture',
    price: 280000,
    description:
      'A compact bedside table with one drawer and an open shelf below. Crafted from solid wood with a smooth waxed finish.',
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80',
    ],
    featured: true,
  },

  // ─ DECOR ─────────────────────────────────────────────────────────────────
  {
    id: 'p12',
    slug: 'wooden-candle-holder',
    name: 'Candle Holder Set',
    category: 'decor',
    price: 32000,
    priceVariants: [
      { label: 'Set of 2', price: 32000 },
      { label: 'Set of 3', price: 45000 },
    ],
    description:
      'Elegant turned candle holders in three varying heights. A warm, natural centrepiece for dining tables or window sills.',
    images: [
      'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&q=80',
    ],
    featured: false,
  },
  {
    id: 'p13',
    slug: 'wall-art-panel',
    name: 'Carved Wall Art Panel',
    category: 'decor',
    price: 150000,
    description:
      'A hand-carved decorative wall panel featuring traditional Tanzanian geometric patterns. A stunning statement piece for any living room or hallway.',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'p14',
    slug: 'fruit-bowl',
    name: 'Hand-turned Fruit Bowl',
    category: 'decor',
    price: 55000,
    description:
      'A wide, shallow bowl turned on a lathe from a single piece of Tanzanian hardwood. Beautiful as a fruit bowl or decorative centrepiece.',
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    ],
    featured: false,
  },
];
