import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      const verified = verify(token, JWT_SECRET);
      return NextResponse.json({ user: verified });
    } catch {
      // If token verification fails, clear the cookie
      const response = NextResponse.json({ user: null });
      response.cookies.set({
        name: 'token',
        value: '',
        maxAge: 0,
      });
      return response;
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
