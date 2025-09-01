import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_APP_URL!)
    );

    // Clear auth-related cookies
    response.cookies.set('next-auth.session-token', '', { maxAge: 0 });
    response.cookies.set('next-auth.csrf-token', '', { maxAge: 0 });
    response.cookies.set('next-auth.callback-url', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
