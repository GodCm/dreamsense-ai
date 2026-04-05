'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to maintenance page
    router.push('/maintenance');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Redirecting...</div>
    </div>
  );
}
