'use client';

import Image from 'next/image';
import logo from '@images/figo_logo.png';
import { AuroraText } from '@/components/magicui/aurora-text';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { MarqueeDemo } from '@/components/marquehorizon';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAdapter } from '@/misc/adapter';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const adapter = await getAdapter();
      if (await adapter.canEagerConnect()) {
        try {
          await adapter.connect();
          const account = await adapter.getAccounts();
          if (account[0]) {
            router.push(`/${account[0].address}/main`);
            localStorage.setItem('walletAddress', account[0].address);
          }
        } catch (error) {
          await adapter.disconnect().catch(() => {});
          console.log(error);
        }
      }
    };
    init();
    // Try eagerly connect
  }, []);

  const connectHandler = async () => {
    const adapter = await getAdapter();
    try {
      await adapter.connect();
      const account = await adapter.getAccounts();
      if (account[0]) {
        router.push(`/${account[0].address}/main`);
        localStorage.setItem('walletAddress', account[0].address);
      }
    } catch (error) {
      // If error, disconnect ignore error
      await adapter.disconnect().catch(() => {});
    }
  };

  return (
    <div className=" min-w-screen h-screen py-[10rem]">
      <div className="w-full z-50 h-max flex flex-col items-center justify-start gap-8">
        <Image src={logo} alt="logo" className="w-[10rem]" />
        <span className="font-semibold md:text-3xl text-2xl relative text-center">
          NFC-Powered Phygital for Multi-Asset NFT Management on{' '}
          <AuroraText>IOTA</AuroraText>
        </span>
        <InteractiveHoverButton className="my-10" onClick={connectHandler}>
          Connect With Nightly
        </InteractiveHoverButton>
        <MarqueeDemo />
      </div>
    </div>
  );
}
