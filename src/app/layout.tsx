import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DebugInfo from '@/components/DebugInfo';

export const metadata: Metadata = {
  title: 'Za Art – Handcrafted Wooden Furniture & Home Accessories Tanzania',
  description:
    'Beautiful handcrafted wooden furniture and home accessories made in Tanzania. Shop trays, kitchen items, decor, and furniture. Order easily via WhatsApp.',
  keywords: ['wooden furniture Tanzania', 'handcrafted wood accessories', 'Za Art', 'wooden trays Tanzania'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script 
          src="https://upload.cloudinary.com/pages/cloudinary_js/2.0/cloudinary-core.min.js" 
          strategy="afterInteractive"
          onLoad={() => {
            console.log('✅ Cloudinary script loaded');
          }}
          onError={() => {
            console.error('❌ Failed to load Cloudinary script');
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <DebugInfo />
      </body>
    </html>
  );
}
