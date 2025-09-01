import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear all auth-related cookies
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('user');
    cookieStore.delete('token');

    // Create response
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Set cookies to expire
    response.cookies.set('session', '', { maxAge: 0 });
    response.cookies.set('user', '', { maxAge: 0 });
    response.cookies.set('token', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
