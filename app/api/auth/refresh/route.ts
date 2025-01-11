import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoDb';
import Token from '@/lib/models/Token';
import { verifyToken, signToken } from '@/lib/token-helper'; // Adjust the path as needed

export async function POST(req: NextRequest) {
	try {
		await connectDB();

		const { refreshToken } = await req.json();

		if (!refreshToken) {
			return NextResponse.json({ message: 'Refresh token is required' }, { status: 400 });
		}

		// Verify the refresh token using your helper
		let decoded;
		try {
			decoded = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
		} catch (err) {
			return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
		}

		const email = decoded.email;

		// Check if the refresh token exists in the database
		const tokenRecord = await Token.findOne({ email, refreshToken });
		if (!tokenRecord) {
			return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
		}

		// Generate a new access token using your helper
		const newAccessToken = await signToken({ email }, process.env.ACCESS_TOKEN_SECRET!, '15m');

		return NextResponse.json({
			accessToken: newAccessToken
		});
	} catch (error) {
		return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
	}
}
