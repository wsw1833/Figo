import React from 'react';
import { Header } from '@/components/header';

export default function mainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let uid: string = '1';
  return (
    <html lang="en">
      <body className={`h-screen py-8`}>
        <Header uid={uid} />
        {children}
      </body>
    </html>
  );
}
