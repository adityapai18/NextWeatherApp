import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/token-helper';

const SIGN_IN = '/';

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
		const response = await fetch(`${process.env.NEXT_URL}api/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken })
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

	console.log('Access Token:', accessToken);
	console.log('Refresh Token:', refreshToken);

	const { pathname } = request.nextUrl;

	// Exclude the root route and /signup
	if (pathname === '/' || pathname.startsWith('/signup')) {
		return NextResponse.next();
	}

	// If no access token is present, attempt to refresh
	if (!accessToken) {
		if (!refreshToken) {
			return NextResponse.redirect(new URL(SIGN_IN, request.url));
		}

		const newAccessToken = await refreshAccessToken(refreshToken);
		if (!newAccessToken) {
			return NextResponse.redirect(new URL(SIGN_IN, request.url));
		}

		// Set new access token in cookies and proceed
		const response = NextResponse.next();
		response.cookies.set('accessToken', newAccessToken, { httpOnly: true });

		// Decode and attach the new access token payload to request
		const decoded = await verifyAndDecodeAccessToken(newAccessToken);
		if (decoded) {
			(request as any).user = decoded;
		}

		return response;
	}

	// Verify and decode the existing access token
	const decoded = await verifyAndDecodeAccessToken(accessToken);
	console.log('Decoded Access Token:', decoded);
	if (decoded) {
		// Attach the decoded token payload to the request object
		(request as any).user = decoded;
		return NextResponse.next();
	}

	// If access token is invalid, attempt to refresh using refresh token
	if (refreshToken) {
		const newAccessToken = await refreshAccessToken(refreshToken);
		if (newAccessToken) {
			// Set new access token in cookies and proceed
			const response = NextResponse.next();
			response.cookies.set('accessToken', newAccessToken, { httpOnly: true });

			// Decode and attach the new access token payload to request
			const newDecoded = await verifyAndDecodeAccessToken(newAccessToken);
			if (newDecoded) {
				(request as any).user = newDecoded;
			}

			return response;
		}
	}

	// Redirect to sign-in if both tokens are invalid
	return NextResponse.redirect(new URL(SIGN_IN, request.url));
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};