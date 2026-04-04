'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
}

export default function HeroCarousel({
  slides,
  intervalMs = 6000,
  className = '',
}: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive(i => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
            quality={85}
          />
        </div>
      ))}
    </div>
  );
}
