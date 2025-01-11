"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { SignupFormData, SignupForm } from '@/components/signup-form';

const SignupPage = () => {
    const router = useRouter();

    const handleSignup = async (data: SignupFormData) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const result = await response.json();
            console.log('Signup successful:', result);

            // Redirect to login page
            router.push('/');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm onSubmit={handleSignup} />
            </div>
        </div>
    );
};

export default SignupPage;