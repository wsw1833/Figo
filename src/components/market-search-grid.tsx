'use client';

import Iota from '@images/Iota-circle.svg';
import Image from 'next/image';
import pinata from '@images/pinata.png';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import MagicalCard from './magicalCard';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { itemsData } from '@/lib/constant';
import { mintComponentNFT } from '@/app/actions/contract/mint_componentNFT';
import { collection_ID } from '@/lib/constant';
import { useToast } from '@/hooks/use-toast';
import { createNFT } from '@/app/actions/nfts/nfts';
import { NFTFormData } from '@/lib/utils';
import { useIotaClient } from '@iota/dapp-kit';

interface Item {
  id: number;
  name: string;
  description: string;
  image_url: string;
  component_type: string;
  ipfs: string;
}

export default function SearchGrid({ addr }: { addr: string | null }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Filter items based on search query
  const filteredItems = itemsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-max flex flex-col items-center justify-center px-10">
      <div className="relative w-full max-w-md my-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search..."
          className="pl-10 focus-visible:ring-[#6067F9] hover:ring-1 ring-[#6067F9] transition-all duration-350"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {filteredItems.map((item) => (
          <MagicalCard
            key={item.id}
            title={item.name}
            description={item.description}
            image={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${item.image_url}`}
            tabs={''}
            onClick={() => {
              setSelectedItem(item);
              setIsSheetOpen(true);
            }}
          />
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedItem && (
            <>
              <SheetDisplay item={selectedItem} account={addr} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SheetDisplay({
  item,
  account,
}: {
  item: Item;
  account: string | null;
}) {
  const { toast } = useToast();
  const client = useIotaClient();
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    const attemptRecovery = async () => {
      if (!account || !navigator.onLine) return;

      const key = `pendingNFTs_${account}`;
      const pendingNFTs = JSON.parse(localStorage.getItem(key) || '[]');

      if (pendingNFTs.length > 0) {
        toast({
          title: 'Syncing pending NFTs',
          description: `Found ${pendingNFTs.length} pending database updates`,
          duration: 3000,
        });

        for (const nft of pendingNFTs) {
          try {
            // Don't use the retry function here, just try once
            const result = await createNFT(nft, account);
            if (result) {
              removeFromLocalBackup(nft, account);
            }
          } catch (error) {
            console.error('Recovery failed for NFT:', nft);
          }
        }
      }
    };

    attemptRecovery();

    // Set up polling to periodically check for pending NFTs
    const intervalId = setInterval(attemptRecovery, 60000); // Check every minute

    // Also try when coming back online
    window.addEventListener('online', attemptRecovery);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', attemptRecovery);
    };
  }, [account]);

  const handleMint = async (item: Item) => {
    if (isMinting) {
      toast({
        title: 'Already processing',
        description: 'Please wait for the current transaction to complete',
        duration: 2000,
      });
      return;
    }

    setIsMinting(true);

    try {
      const createdObjectId = await mintComponentNFT(
        collection_ID,
        item.name,
        item.description,
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${item.image_url}`,
        item.component_type,
        client
      );

      if (!createdObjectId) {
        throw new Error('Failed to create object ID');
      }
      const formData: NFTFormData = {
        objectID: createdObjectId?.toString(),
        name: item.name,
        description: item.description,
        image_url: item.image_url,
        component_type: item.component_type,
        ipfs: item.ipfs,
      };

      const dbResult = await writeToDBWithRetry(formData, account);

      if (dbResult) {
        toast({
          title: 'NFT Minting Successfully Completed!',
          description: 'Check the transaction on Iota Testnet Explorer',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Minting error:', error);

      toast({
        title: 'NFT Minting Failed!',
        description:
          error instanceof Error ? error.message : 'Failed to mint the NFT',
        duration: 5000,
      });
    } finally {
      setIsMinting(false);
    }
  };

  const writeToDBWithRetry = async (
    formData: NFTFormData,
    account: string | null,
    retries = 5
  ): Promise<boolean> => {
    if (!account) return false;

    saveToLocalBackup(formData, account);

    // Try multiple times with increasing delays
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await createNFT(formData, account);

        if (result) {
          removeFromLocalBackup(formData, account);
          return true;
        }

        console.log(`DB write attempt ${attempt + 1} failed, retrying...`);

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      } catch (error) {
        console.error(`DB write attempt ${attempt + 1} error:`, error);

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }

    toast({
      title: 'Database Update Issue',
      description:
        'Transaction completed on blockchain but database update is pending. Will retry automatically.',
      duration: 5000,
    });

    // Keep in localStorage for recovery
    return false;
  };

  // Helper functions for local backup
  const saveToLocalBackup = (formData: NFTFormData, account: string | null) => {
    if (!account) return;

    const key = `pendingNFTs_${account}`;
    const pendingNFTs = JSON.parse(localStorage.getItem(key) || '[]');
    pendingNFTs.push({
      ...formData,
      timestamp: Date.now(),
    });
    localStorage.setItem(key, JSON.stringify(pendingNFTs));
  };

  const removeFromLocalBackup = (
    formData: NFTFormData,
    account: string | null
  ) => {
    if (!account) return;

    const key = `pendingNFTs_${account}`;
    const pendingNFTs = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = pendingNFTs.filter(
      (nft: any) => nft.objectID !== formData.objectID
    );
    localStorage.setItem(key, JSON.stringify(filtered));
  };

  return (
    <>
      <SheetHeader>
        <div className="text-xs text-muted-foreground font-medium flex flex-row relative items-start gap-2 w-full h-fit">
          Molly Equipment 1.0
        </div>
        <SheetTitle className="text-xl font-bold flex relative items-start">
          {item.name}
        </SheetTitle>
        <SheetDescription className=" gap-2 flex flex-row w-max items-center justify-center">
          <Badge
            variant="outline"
            className="gap-1 p-1 w-fit flex flex-row items-center justify-center"
          >
            <Image
              src={Iota || '/placeholder.svg'}
              alt="iota"
              className="w-4 h-4"
            />
            Iota
          </Badge>
        </SheetDescription>
      </SheetHeader>
      <div className="py-6">
        <div className="w-full h-[18rem] flex flex-col items-center justify-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${item.image_url}`}
            alt="componentNFT"
            width={150}
            height={150}
            className="w-max h-max"
          />
        </div>
        <h3 className="font-medium text-lg">Asset Description</h3>
        <p className="text-base mb-4">{item.description}</p>
        <div className="space-y-4"></div>
        <h3 className="font-medium text-lg my-1">Accessories Type</h3>
        <Badge
          variant="outline"
          className="p-1 w-fit border-2 border-[#4C52E2] text-[#4C52E2] font-medium"
        >
          {item.component_type}
        </Badge>
      </div>
      <SheetFooter className="w-full gap-2">
        <Button
          className="w-full bg-[#4C52E2] hover:bg-[#3733CB]"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${item.ipfs}`,
              '_blank'
            )
          }
        >
          Inspect IPFS on Pinata{' '}
          <Image
            src={pinata || '/placeholder.svg'}
            alt="pinata IPFS"
            className="w-5 h-5"
          />
        </Button>
        <Button
          className="w-full bg-[#4CABFFFF] hover:bg-[#0496ff]"
          onClick={() => handleMint(item)}
        >
          Mint Component
        </Button>
      </SheetFooter>
    </>
  );
}
