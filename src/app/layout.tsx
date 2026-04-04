import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
