'use client';

import { BottomTabs } from '@/components/bottom-navigation';

export default function homeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-max h-full">
      {children}
      <BottomTabs />
    </div>
  );
}
