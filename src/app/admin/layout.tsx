import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) redirect('/auth/login');

  async function signOut() {
    'use server';
    const sb = await createSupabaseServerClient();
    await sb.auth.signOut();
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-wood-50">
      {/* Admin top bar */}
      <header className="bg-wood-900 text-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/Gemini_Generated_Image_zee862zee862zee8.png"
            alt="Za Art logo"
            width={28}
            height={28}
            className="rounded-md object-contain"
          />
          <span className="font-display font-bold text-lg">Za Art Admin</span>
        </div>

        <nav className="flex items-center gap-4 text-sm flex-wrap">
          <Link href="/admin" className="hover:text-wood-200 font-medium transition-colors">
            Dashboard
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-wood-600 hover:bg-wood-500 px-4 py-2 rounded-xl font-semibold transition-colors"
          >
            + New Product
          </Link>
          <Link href="/" target="_blank" className="hover:text-wood-200 transition-colors">
            View Site ↗
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="hover:text-wood-200 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </nav>
      </header>

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-4 py-10">{children}</div>
    </div>
  );
}
