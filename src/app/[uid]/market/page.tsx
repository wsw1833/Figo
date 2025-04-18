'use client';

import React from 'react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import SearchGrid from '@/components/market-search-grid';

const market = () => {
  return (
    <div className="w-full min-h-max h-screen flex flex-col items-start justify-center py-16">
      <SparklesText className="w-full flex items-center justify-center mb-4">
        MarketPlace
      </SparklesText>
      <SearchGrid />
    </div>
  );
};

export default market;
