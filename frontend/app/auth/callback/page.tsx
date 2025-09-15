"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      await fetchUser();
      console.log('Authentication callback processed. Redirecting...');
      router.push('/'); // Redirect to a protected route or home page
    };

    if (typeof window !== 'undefined') {
      handleCallback();
    }
  }, [router, fetchUser]);

  // You can render a loading state while processing the callback
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
      Processing authentication...
    </div>
  );
}
