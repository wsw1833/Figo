'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function mainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`min-h-max h-full py-8 flex flex-col items-center justify-center`}
    >
      <Avatar className="w-14 h-14 my-4">
        <AvatarImage
          src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/512/IOTA-icon.png"
          alt="@avatar"
        />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>
      {children}
    </div>
  );
}
