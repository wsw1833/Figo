'use client';

import { Home, ShoppingBag } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function BottomTabs({ addr }: { addr: string | null }) {
  const pathname = usePathname();

  const isMarketPage = pathname.includes('/market');
  const activeTab = isMarketPage ? 'market' : 'main';

  return (
    <div
      className={
        'fixed bottom-10 left-0 right-0 flex w-full items-center justify-center z-100'
      }
    >
      <Tabs
        value={activeTab}
        className="w-full flex flex-col h-max items-center justify-center "
      >
        <TabsList className="h-max bg-[#F7F7F7]">
          <Link href={`/${addr}/main`} passHref className="w-full">
            <TabsTrigger value="main" className="px-6">
              <Home className="h-6 w-6" />
            </TabsTrigger>
          </Link>

          <Link href={`/${addr}/market`} passHref className="w-full">
            <TabsTrigger value="market" className="px-6">
              <ShoppingBag className="h-6 w-6" />
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}
