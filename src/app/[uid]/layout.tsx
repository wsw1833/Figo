'use client';

import { BottomTabs } from '@/components/bottom-navigation';
import { Header } from '@/components/header';
import { useCurrentWallet } from '@iota/dapp-kit';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function homeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { connectionStatus } = useCurrentWallet();
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      router.push('/');
    }
    const addr = localStorage.getItem('walletAddress');
    if (addr) setAddress(addr);
  }, []);

  return (
    <div className="min-h-max h-full py-8">
      <Header addr={address} />

      {children}
      <BottomTabs addr={address} />
    </div>
  );
}
