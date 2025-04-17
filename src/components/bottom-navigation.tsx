'use client';

import { Home, ShoppingBag } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function BottomTabs() {
  const pathname = usePathname();

  const isMarketPage = pathname.includes('/market');
  const activeTab = isMarketPage ? 'market' : 'main';

  return (
    <div
      className={
        'fixed bottom-10 left-0 right-0 flex w-full items-center justify-center z-50'
      }
    >
      <Tabs
        value={activeTab}
        className="w-full rounded-none flex h-max items-center justify-center"
      >
        <TabsList className="bg-[#F3F3F3]">
          <Link href="/1/main" passHref className="w-full">
            <TabsTrigger value="main" className="w-[10rem]">
              <Home className="h-5 w-5" />
              <span>Main Page</span>
            </TabsTrigger>
          </Link>

          <Link href="/1/market" passHref className="w-full">
            <TabsTrigger value="market" className="w-[10rem]">
              <ShoppingBag className="h-5 w-5" />
              <span>Marketplace</span>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}
