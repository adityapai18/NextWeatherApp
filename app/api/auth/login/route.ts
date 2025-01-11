import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import Token from '@/lib/models/Token';
import dbConnect from '@/lib/mongoDb';
import { serialize } from 'cookie';
import { signToken } from '@/lib/token-helper';
import { internalServerErrorResponse, successResponse } from '@/lib/responses';

// Environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse request body
    const { email, password } = await req.json();

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Generate access and refresh tokens
    const accessToken = await signToken({ email: user.email }, ACCESS_TOKEN_SECRET, '15m');
    const refreshToken = await signToken({ email: user.email }, REFRESH_TOKEN_SECRET, '7d');

    // Store the refresh token in the database
    await Token.findOneAndUpdate(
      { email: user.email },
      { refreshToken },
      { upsert: true, new: true }
    );

    // Set the cookies
    const accessTokenCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/'
    });

    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    // Send the success response with cookies
    const response = successResponse({ message: 'Login successful' });
    response.headers.set('Set-Cookie', accessTokenCookie);
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;

  } catch (error) {
    // Internal server error handling
    return internalServerErrorResponse('Internal server error');
  }
}
