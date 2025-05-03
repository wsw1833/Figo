'use client';

import { BottomTabs } from '@/components/bottom-navigation';
import { Header } from '@/components/header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>('');

  useEffect(() => {
    const addr = localStorage.getItem('walletAddress');
    if (!addr) {
      router.push('/');
    }
    setAddress(addr);
  }, []);

  return (
    <div className="min-h-max h-full py-4">
      <Header addr={address} />

      {children}
      <BottomTabs addr={address} />
      <Toaster />
    </div>
  );
}
