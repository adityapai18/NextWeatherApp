// types/next-request.d.ts

import 'next/server';

declare module 'next/server' {
	interface NextRequest {
		user?: {
			email: string;
			iat: number;
			exp: number;
		};
	}
}