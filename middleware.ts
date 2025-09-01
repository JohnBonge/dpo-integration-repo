import { withAuth } from 'next-auth/middleware';

// Simple middleware that requires authentication for dashboard routes
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// Only protect dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
