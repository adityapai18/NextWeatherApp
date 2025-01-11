"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const result = await response.json();
      console.log('Login successful:', result);

      // Redirect to home page
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;