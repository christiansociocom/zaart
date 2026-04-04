/**
 * Base URL for OAuth redirects. Set NEXT_PUBLIC_SITE_URL in production (e.g.
 * https://zaart.vercel.app) so it matches Supabase "Redirect URLs" exactly.
 * Falls back to the current browser origin for local dev and preview deploys.
 */
export function getOAuthCallbackOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (explicit) return explicit;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}
