import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/token-helper';

const SIGN_IN = '/';
const DASHBOARD = '/dashboard';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// Helper function to verify and decode the access token
async function verifyAndDecodeAccessToken(token: string) {
  try {
    const decoded = await verifyToken(token, ACCESS_TOKEN_SECRET);
    return decoded as {
      email: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    console.error('Error verifying access token:', error);
    return null;
  }
}

// Helper function to refresh access token
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  let accessToken = cookies.get('accessToken')?.value;
  const refreshToken = cookies.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  // Handle the root route
  if (pathname === '/') {
    // If access token exists, verify it
    if (accessToken) {
      const decoded = await verifyAndDecodeAccessToken(accessToken);
      if (decoded) {
        // Redirect to /dashboard if access token is valid
        return NextResponse.redirect(new URL(DASHBOARD, request.url));
      }
    }

    // If no valid access token, try to refresh using the refresh token
    if (refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        // Set new access token in cookies and redirect to /dashboard
        const response = NextResponse.redirect(new URL(DASHBOARD, request.url));
        response.cookies.set('accessToken', newAccessToken, { httpOnly: true });
        return response;
      }
    }

    // If both tokens are invalid, remain on /
    return NextResponse.next();
  }

  // For other protected routes, ensure the user is authenticated
  if (!accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL(SIGN_IN, request.url));
    }

    // Refresh the access token if possible
    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      return NextResponse.redirect(new URL(SIGN_IN, request.url));
    }

    // Set new access token and continue to the requested route
    const response = NextResponse.next();
    response.cookies.set('accessToken', newAccessToken, { httpOnly: true });

    // Attach the decoded token payload to the request object
    const decoded = await verifyAndDecodeAccessToken(newAccessToken);
    if (decoded) {
      (request as any).user = decoded;
    }

    return response;
  }

  // Verify and decode the existing access token
  const decoded = await verifyAndDecodeAccessToken(accessToken);
  if (decoded) {
    (request as any).user = decoded;
    return NextResponse.next();
  }

  // Redirect to sign-in if both tokens are invalid
  return NextResponse.redirect(new URL(SIGN_IN, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
