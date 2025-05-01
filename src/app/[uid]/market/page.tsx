'use client';

import React, { useEffect, useState } from 'react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import SearchGrid from '@/components/market-search-grid';

const Market = () => {
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    const addr = localStorage.getItem('walletAddress');
    if (addr) {
      setAccount(addr);
    }
  }, []);

  return (
    <div className="w-full min-h-max h-screen flex flex-col items-start justify-center py-16">
      <SparklesText className="w-full flex items-center justify-center mb-4">
        MarketPlace
      </SparklesText>
      <SearchGrid addr={account} />
    </div>
  );
};

export default Market;
