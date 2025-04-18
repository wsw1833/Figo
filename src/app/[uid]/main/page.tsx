'use client';

import React from 'react';
import CopyClipboardBtn from '@/components/copyClipboardBtn';
import TabsWithSearchGrid from '@/components/tabs-with-search';

const main = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start">
      <CopyClipboardBtn />
      <TabsWithSearchGrid />
    </div>
  );
};

export default main;
