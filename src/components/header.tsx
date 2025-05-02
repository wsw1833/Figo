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
import { getObjectDigest } from '@/app/actions/contract/get-object';

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
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const client = useIotaClient();

  useEffect(() => {
    const addr = localStorage.getItem('walletAddress');
    setAccount(addr);

    // Check NFC support on component mount
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  const disconnectHandler = async () => {
    try {
      const adapter = await getAdapter();
      await adapter.disconnect();
      localStorage.removeItem('walletAddress');
      setAccount(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleScan = async () => {
    if (!nfcSupported) {
      toast({
        title: 'Web NFC API is not supported in this browser.',
        duration: 3000,
      });
      return;
    }

    if (!account) {
      toast({
        title: 'Please connect your wallet first',
        duration: 3000,
      });
      return;
    }

    try {
      setIsScanning(true);
      toast({
        title: 'Scanning NFC tag...',
        duration: 2000,
      });

      const ndef = new window.NDEFReader();
      await ndef.scan();

      ndef.addEventListener('reading', async ({ message }) => {
        // Parse NFC data
        const nfcData: NfcData = {};
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const text = new TextDecoder(record.encoding).decode(record.data);
            const [key, ...valueParts] = text.split(':');
            if (key) {
              nfcData[key] = valueParts.join(':');
            }
          }
        }

        // Validate NFC data
        if (!nfcData.name || !nfcData.description || !nfcData.image_url) {
          toast({
            title: 'Invalid NFC data',
            description: 'The NFC tag is missing required information',
            duration: 3000,
          });
          setIsScanning(false);
          return;
        }

        toast({
          title: 'NFC Data Read Successfully',
          description: `Found: ${nfcData.name}`,
          duration: 2000,
        });

        // Proceed with minting
        try {
          const txid = await mintParentNFT(
            collection_ID,
            nfcData.name,
            nfcData.description,
            `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${nfcData.image_url}`
          );

          monitorParentTransactionForObjectId(txid, nfcData);

          toast({
            title: 'Transaction Submitted',
            description:
              'Your NFT minting transaction has been sent to the blockchain',
            duration: 3000,
          });
        } catch (error) {
          toast({
            title: 'NFT Minting Failed!',
            description:
              error instanceof Error ? error.message : 'Failed to mint the NFT',
            duration: 3000,
          });
        } finally {
          setIsScanning(false);
        }
      });

      ndef.addEventListener('readingerror', () => {
        toast({
          title: 'Error reading NFC',
          description: 'Failed to read NFC tag data',
          duration: 3000,
        });
        setIsScanning(false);
      });
    } catch (error) {
      toast({
        title: `Error initializing NFC reader`,
        description: error instanceof Error ? error.message : String(error),
        duration: 3000,
      });
      setIsScanning(false);
    }
  };

  const monitorParentTransactionForObjectId = (
    txid: string,
    nfcData: NfcData
  ) => {
    // Configure monitoring parameters
    const maxAttempts = 60; // 10 minutes at 10-second intervals
    const intervalTime = 10000; // 10 seconds
    let attempts = 0;

    // Start the monitoring interval
    const intervalId = setInterval(async () => {
      try {
        attempts++;
        console.log(
          `Checking parent transaction ${txid}, attempt ${attempts}/${maxAttempts}`
        );

        // Check if objectID has been created
        const createdObjectId = await getObjectDigest(client, txid);

        // If we have an objectID, record it and stop monitoring
        if (createdObjectId) {
          clearInterval(intervalId);
          console.log(`Parent NFT ObjectID created: ${createdObjectId}`);

          // Record to database directly
          const formData: NFTFormData = {
            objectID: createdObjectId.toString(),
            name: nfcData.name,
            description: nfcData.description,
            image_url: nfcData.image_url,
            ipfs: nfcData.ipfs,
          };

          try {
            await createNFT(formData, account);

            toast({
              title: 'NFC NFT Minting Completed!',
              description: 'Your NFT has been minted and recorded successfully',
              duration: 3000,
            });
          } catch (dbError) {
            console.error('Error writing to database:', dbError);
            toast({
              title: 'Database Error',
              description: 'Transaction completed but database update failed.',
              duration: 5000,
            });
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);

          toast({
            title: 'Transaction Verification Timeout',
            description:
              'The transaction is taking longer than expected. Check status later.',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error monitoring transaction:', error);

        if (attempts >= maxAttempts) {
          clearInterval(intervalId);

          toast({
            title: 'Transaction Verification Error',
            description: 'There was an error verifying your transaction.',
            duration: 5000,
          });
        }
      }
    }, intervalTime);

    // Store the interval ID for potential cleanup
    const activeIntervals = JSON.parse(
      sessionStorage.getItem('activeMonitoringIntervals') || '{}'
    );
    activeIntervals[txid] = intervalId;
    sessionStorage.setItem(
      'activeMonitoringIntervals',
      JSON.stringify(activeIntervals)
    );
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
                  disabled={isScanning}
                >
                  Scan
                  <Image
                    src={nightly}
                    alt="logo"
                    className="w-6 h-6"
                    priority
                  />
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
