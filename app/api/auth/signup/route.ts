import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User'; // Adjust the import according to your project structure
import dbConnect from '@/lib/mongoDb'; // Adjust the import according to your project structure
import { badRequestResponse, internalServerErrorResponse, successResponse } from '@/lib/responses';

export async function POST(req: NextRequest) {
    await dbConnect();

    const { username, email, password, confirmPassword } = await req.json();

    if (password !== confirmPassword) {
        return badRequestResponse("Passwords don't match");
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return badRequestResponse('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            cities: {}
        });

        await newUser.save();

        return successResponse({ message: 'user created successfully' });
    } catch (error) {
        return internalServerErrorResponse('Internal server error');
    }
}