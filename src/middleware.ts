import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const SELLER_EMAIL = process.env.NEXT_PUBLIC_SELLER_EMAIL!;

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, opts: CookieOptions) {
          res.cookies.set({ name, value, ...opts });
        },
        remove(name: string, opts: CookieOptions) {
          res.cookies.set({ name, value: '', ...opts });
        },
      },
    }
  );

  const {
    data: { user },
  } = await sb.auth.getUser();

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (user.email !== SELLER_EMAIL) {
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
