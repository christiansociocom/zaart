import type { Metadata } from 'next';
import Image from 'next/image';
import { generalWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Contact Us – Za Art',
  description: 'Get in touch with Za Art for orders and inquiries.',
};

export default function ContactPage() {
  const phoneDisplay = WHATSAPP_NUMBER.startsWith('255')
    ? `+${WHATSAPP_NUMBER}`
    : WHATSAPP_NUMBER;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        {/* Replace /icons/contact-hero.png with your own illustration */}
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <Image src="/icons/contact-hero.png" alt="Contact us" fill className="object-contain" />
        </div>
        <h1 className="section-heading mb-3">Contact Us</h1>
        <p className="text-bark-600 text-lg">
          We&apos;re here for orders, questions, and custom requests.
        </p>
      </div>

      <div className="card p-8 space-y-6">
        {/* WhatsApp — primary */}
        <div className="text-center">
          <p className="text-bark-600 mb-4 text-base">
            The easiest way to reach us is WhatsApp. Tap the button and send us a message!
          </p>
          <a
            href={generalWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-lg px-10 py-5 w-full sm:w-auto"
          >
            <WAIcon />
            Chat on WhatsApp
          </a>
        </div>

        <hr className="border-sand" />

        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-wood-100 rounded-xl flex items-center justify-center shrink-0">
            {/* Replace /icons/contact-phone.png with your own phone icon */}
            <div className="w-7 h-7 relative">
              <Image src="/icons/contact-phone.png" alt="Phone" fill className="object-contain" />
            </div>
          </div>
          <div>
            <p className="text-sm text-bark-500 mb-0.5">Phone / WhatsApp</p>
            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="text-xl font-bold text-wood-800 hover:text-wood-600 transition-colors"
            >
              {phoneDisplay}
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-wood-100 rounded-xl flex items-center justify-center shrink-0">
            {/* Replace /icons/contact-location.png with your own location icon */}
            <div className="w-7 h-7 relative">
              <Image src="/icons/contact-location.png" alt="Location" fill className="object-contain" />
            </div>
          </div>
          <div>
            <p className="text-sm text-bark-500 mb-0.5">Location</p>
            <p className="text-lg font-semibold text-wood-800">Tanzania</p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-wood-100 rounded-xl flex items-center justify-center shrink-0">
            {/* Replace /icons/contact-hours.png with your own clock icon */}
            <div className="w-7 h-7 relative">
              <Image src="/icons/contact-hours.png" alt="Hours" fill className="object-contain" />
            </div>
          </div>
          <div>
            <p className="text-sm text-bark-500 mb-0.5">Hours</p>
            <p className="text-lg font-semibold text-wood-800">Mon – Sat, 8am – 6pm</p>
          </div>
        </div>
      </div>

      <p className="text-center text-bark-500 text-sm mt-8">
        We usually reply within a few hours. We also accept custom orders!
      </p>
    </div>
  );
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
