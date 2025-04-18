'use client';

import { BottomTabs } from '@/components/bottom-navigation';
import { Header } from '@/components/header';

export default function homeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uid: string = '1';

  return (
    <div className="min-h-max h-full py-8">
      <Header uid={uid} />

      {children}
      <BottomTabs />
    </div>
  );
}
