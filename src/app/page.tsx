'use client';

import Image from 'next/image';
import logo from '@images/figo_logo.png';
import { AuroraText } from '@/components/magicui/aurora-text';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { MarqueeDemo } from '@/components/marquehorizon';
import { useRouter } from 'next/navigation';
import { ConnectModal, useCurrentWallet } from '@iota/dapp-kit';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { currentWallet, connectionStatus, isConnected } = useCurrentWallet();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isConnected) {
      let addresses = currentWallet.accounts;
      router.push(`/${addresses[0].address}/main`);
      localStorage.setItem('walletAddress', addresses[0].address);
    }
  }, [isConnected, router]);

  const connectHandler = () => {
    if (isConnected) {
      let addresses = currentWallet.accounts;
      router.push(`/${addresses[0].address}/main`);
      localStorage.setItem('walletAddress', addresses[0].address);
    } else {
      setOpen(true);
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
        <ConnectModal
          trigger={
            <InteractiveHoverButton
              disabled={!connectionStatus}
              className="my-10"
              onClick={connectHandler}
            >
              {isConnected
                ? 'Connected'
                : connectionStatus
                ? 'Connect With Nightly'
                : 'Connecting...'}
            </InteractiveHoverButton>
          }
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        />
        <MarqueeDemo />
      </div>
    </div>
  );
}
