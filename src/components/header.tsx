'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import nightly from '@images/nfc.svg';
import logo from '@images/figo_logo.png';
import nfcScanAnimation from '@images/mobileNfc.json';
import Lottie from 'lottie-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from './ui/navigation-menu';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from './ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { mintParentNFT } from '@/app/actions/contract/mint_parentNFT';
import { collection_ID } from '@/lib/constant';
import { getAdapter } from '@/misc/adapter';
import { createNFT } from '@/app/actions/nfts/nfts';
import { NFTFormData } from '@/lib/utils';
import { useIotaClient } from '@iota/dapp-kit';

interface NfcData {
  [key: string]: string | undefined;
  name?: string;
  description?: string;
  image_url?: string;
  ipfs?: string;
}

export function Header({ addr }: { addr: string | null }): JSX.Element {
  const [account, setAccount] = useState<string | null>('');
  const [nfcSupported, setNfcSupported] = useState(false);
  const [scanData, setScanData] = useState<NfcData | null>(null);
  const { toast } = useToast();
  const client = useIotaClient();

  useEffect(() => {
    const addr = localStorage.getItem('walletAddress');
    setAccount(addr);
  }, []);

  const disconnectHandler = async () => {
    try {
      const adapter = await getAdapter();
      await adapter.disconnect();
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.log(error);
    }
  };

  // const mockScanData: NFTFormData = {
  //   name: 'Garfield',
  //   description:
  //     'A laid-back, sarcastic vibe with its cool expression and iconic orange stripes.',
  //   image_url: `QmcKJ24X74eh2NK1FYMsRtMwWiYRBsKe1u22irpTWpuW8J`,
  //   ipfs: `QmcKJ24X74eh2NK1FYMsRtMwWiYRBsKe1u22irpTWpuW8J`,
  // };

  const read = async () => {
    if (!nfcSupported) return;

    try {
      const ndef = new window.NDEFReader();

      await ndef.scan();

      ndef.addEventListener('reading', ({ message }) => {
        const result: NfcData = {};

        for (const record of message.records) {
          if (record.recordType === 'text') {
            const text = new TextDecoder(record.encoding).decode(record.data);
            const [key, ...valueParts] = text.split(':');
            if (key) {
              result[key] = valueParts.join(':');
            }
          }
        }
        setScanData(result);
      });

      ndef.addEventListener('readingerror', () => {});
    } catch (error) {
      toast({
        title: `Error reading NFC: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  };

  const handleScan = async () => {
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true);
      await read();
      handleMintParent();
    } else {
      toast({
        title: 'Web NFC API is not supported in this browser.',
        duration: 10000,
      });
    }
  };

  const handleMintParent = async () => {
    if (!scanData || !account) return;

    try {
      const createdObjectId = await mintParentNFT(
        collection_ID,
        scanData.name,
        scanData.description,
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${scanData.image_url}`,
        client
      );

      const formData: NFTFormData = {
        objectID: createdObjectId?.toString(),
        name: scanData.name,
        description: scanData.description,
        image_url: scanData.image_url,
        ipfs: scanData.ipfs,
      };

      const result = await createNFT(formData, account);

      if (result) {
        toast({
          title: 'NFT Minting Successfully!',
          description: 'Check the transaction on Iota Testnet Explorer',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'NFT Minting Failed!',
        description: 'Failed to mint the NFT',
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full h-max flex flex-row md:px-16 sm:px-6 px-4 items-start justify-between">
      <Image src={logo} alt="logo" className="w-14 h-14" priority />

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  className={`${navigationMenuTriggerStyle()} gap-1 md:text-lg flex items-center justify-center`}
                  onClick={handleScan}
                >
                  Scan
                  <Image src={nightly} alt="logo" className="w-6 h-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="h-max gap-3 w-full flex items-center justify-center">
                <DrawerHeader>
                  <DrawerTitle className="md:text-3xl text-xl relative flex items-start justify-center">
                    Ready to Scan
                  </DrawerTitle>
                  <DrawerDescription className="w-full relative flex flex-col justify-center">
                    <Lottie
                      animationData={nfcScanAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: 300, height: 300 }}
                    />
                    <span className="w-full relative flex justify-center md:text-base">
                      Please place the device close to the Figo.
                    </span>
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="w-[10rem] md:text-base"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="md:text-lg">
              Settings
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-max gap-3 md:p-4 p-2">
                <ListItem
                  href={`/${addr}/main`}
                  title="Profile"
                  icon={<User className="h-4 w-4" />}
                >
                  Manage your NFT collection.
                </ListItem>
                <ListItem
                  href="/"
                  title="Logout"
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={disconnectHandler}
                >
                  Sign out of your account
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

// Enhanced ListItem with icon support
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium leading-none">{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
