'use client';

import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { getOAuthCallbackOrigin } from '@/lib/site-url';

export default function LoginPage() {
  async function signInWithGoogle() {
    const origin = getOAuthCallbackOrigin();
    const redirectTo = `${origin}/auth/callback?next=/admin`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-sm w-full p-10 text-center">
        <Image
          src="/logos/Gemini_Generated_Image_zee862zee862zee8.png"
          alt="Za Art logo"
          width={64}
          height={64}
          className="mx-auto mb-4 rounded-md object-contain"
        />
        <h1 className="font-display text-xl font-bold text-wood-900 mb-2">Za Art Admin</h1>
        <p className="text-bark-600 text-sm mb-8">
          Sign in with your Google account to manage products.
        </p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-4 py-3 text-sm font-medium text-[#1f1f1f] shadow-sm transition hover:bg-[#f8f9fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood-600"
        >
          <GoogleGLogo className="h-[18px] w-[18px] shrink-0" />
          <span className="font-medium tracking-tight">Sign in with Google</span>
        </button>
        <p className="text-xs text-bark-400 mt-6">
          Only the authorised seller account can access this area.
        </p>
      </div>
    </div>
  );
}

/** Official multicolor "G" mark (Google brand colors). */
function GoogleGLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.8 7.18l7.73 6C43.98 37.98 46.98 31.69 46.98 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}
