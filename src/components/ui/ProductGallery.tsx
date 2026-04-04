'use client';

import { useState } from 'react';
import Image from 'next/image';
import { buildWhatsAppLink } from '@/lib/db';
import type { Product } from '@/lib/db';

interface Props {
  product: Product;
}

export default function ProductGallery({ product }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // ✅ FIXED: Safe fallback for images array
  const images = product.images && Array.isArray(product.images) ? product.images : [];
  const hasImages = images.length > 0;

  const variants = product.price_variants;
  const currentPrice = variants ? variants[selectedVariant]?.price : product.price;
  const waLink = buildWhatsAppLink(
    variants ? `${product.name} – ${variants[selectedVariant]?.label}` : product.name,
    currentPrice ?? product.price
  );

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Images */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-bark-100 shadow-md">
          {/* ✅ FIXED: Safe image display */}
          {hasImages && images[activeImg] ? (
            <Image
              src={images[activeImg]}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🪵</div>
          )}
        </div>

        {/* ✅ FIXED: Use images variable */}
        {hasImages && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeImg ? 'border-wood-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="badge mb-2">{product.category.replace(/-/g, ' ')}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wood-900 leading-tight mt-2">
            {product.name}
          </h1>
        </div>

        {/* Price */}
        <div className="bg-wood-50 rounded-2xl px-6 py-4 border border-wood-100">
          <p className="text-sm text-bark-500 mb-1">Price</p>
          <p className="text-3xl font-bold text-wood-700">
            Tshs {(currentPrice ?? product.price).toLocaleString()}
          </p>
        </div>

        {/* Variants */}
        {variants && variants.length > 1 && (
          <div>
            <p className="font-semibold text-wood-800 mb-3">Choose size / option:</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVariant(i)}
                  className={`px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                    i === selectedVariant
                      ? 'border-wood-600 bg-wood-600 text-white shadow-md'
                      : 'border-wood-300 text-wood-700 hover:border-wood-500'
                  }`}
                >
                  <span className="block">{v.label}</span>
                  <span className="block text-xs opacity-75">Tshs {v.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-bark-700 leading-relaxed text-base">{product.description}</p>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full text-base py-4 text-center"
          >
            <WAIcon />
            Order on WhatsApp
          </a>
          <p className="text-center text-sm text-bark-500">
            Tap the button above → message us on WhatsApp → we deliver to you 🚚
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { icon: '🪵', label: 'Real Wood' },
            { icon: '🇹🇿', label: 'Made in Tanzania' },
            { icon: '✋', label: 'Handcrafted' },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center gap-1 bg-wood-50 rounded-xl p-3">
              <span className="text-2xl">{b.icon}</span>
              <span className="text-xs font-medium text-wood-700 text-center">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-1.959-.173-.198-.09-.304.13-.508.129-.129.297-.336.446-.52.149-.184.198-.299.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.243-.579-.487-.501-.67-.51-.173-.009-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.228 1.36.196 1.871.119.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-2.176 0-4.315.67-6.097 1.91L4.865 2.652 6.845 9.401c-1.33 1.902-2.103 4.203-2.103 6.66 0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
