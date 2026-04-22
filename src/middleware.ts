import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/toggle',
  '/api-docs',
  '/api/openapi.json',
];

const SECRET = process.env.ENCRYPTION_SECRET ?? 'offline-default-secret-change-in-production';

/**
 * Verifies a session token produced by src/lib/auth/session.ts signToken().
 * Format: userId:nonce:hmac-sha256-hex
 * Returns the userId if valid, null otherwise.
 * Uses Web Crypto API (crypto.subtle) which is available in the Next.js Edge runtime.
 */
async function verifySessionToken(token: string): Promise<string | null> {
  const lastColon = token.lastIndexOf(':');
  if (lastColon < 0) return null;
  const payload = token.slice(0, lastColon);
  const sig = token.slice(lastColon + 1);

  const encoder = new TextEncoder();
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
  } catch {
    return null;
  }

  // Parse the hex signature into bytes
  const sigBytes = sig.match(/.{2}/g)?.map((byte) => parseInt(byte, 16));
  if (!sigBytes || sigBytes.length !== 32) return null;

  // crypto.subtle.verify performs a timing-safe comparison internally
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    new Uint8Array(sigBytes),
    encoder.encode(payload)
  );

  if (!isValid) return null;

  const parts = payload.split(':');
  return parts.length >= 2 ? (parts[0] ?? null) : null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check if auth is enabled via cookie (set by the toggle API route).
  // The settings DB isn't accessible from middleware (Edge runtime).
  // NOTE: This cookie is client-forgeable — any script can send auth_enabled=false
  // to skip auth. This is an accepted design limitation for a local, single-user tool
  // where physical access to the machine already implies full access.
  const authEnabled = req.cookies.get('auth_enabled')?.value === 'true';

  if (!authEnabled) {
    return NextResponse.next();
  }

  const session = req.cookies.get('session')?.value;
  if (!session || !(await verifySessionToken(session))) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
