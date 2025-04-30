'use client';

import React, { Suspense, useEffect, useState } from 'react';
import CopyClipboardBtn from '@/components/copyClipboardBtn';
import TabsWithSearchGrid from '@/components/tabs-with-search';
import { fetchOwner } from '@/app/actions/owner/owner';

// Create a wrapper that will show suspense
const MainWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  );
};

// Your main component (renamed from main to Main)
const Main = () => {
  const [ownerData, setOwnerData] = useState<any>(null); // Initialize as null

  useEffect(() => {
    const init = async () => {
      const addr = localStorage.getItem('walletAddress');
      if (addr) {
        const result = await fetchOwner(addr);
        setOwnerData(result.result);
      }
    };
    init();
  }, []);

  if (!ownerData) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <CopyClipboardBtn />
      <TabsWithSearchGrid
        ParentNFT={ownerData.parentNFTs}
        ComponentNFT={ownerData.componentNFTs}
      />
    </div>
  );
};

export default MainWithSuspense;
