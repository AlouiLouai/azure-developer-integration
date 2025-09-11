"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = () => {
      // With HttpOnly cookies, the token is automatically handled by the browser.
      // This page simply serves as a redirect target after successful authentication.
      console.log('Authentication callback processed. Redirecting...');
      router.push('/'); // Redirect to a protected route or home page
    };

    // Ensure this runs only once and after the component is mounted
    if (typeof window !== 'undefined') {
      handleCallback();
    }
  }, [router]);

  // You can render a loading state while processing the callback
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
      Processing authentication...
    </div>
  );
}
