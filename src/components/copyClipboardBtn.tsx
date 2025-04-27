'use client';

import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { formatAddress } from '@/lib/utils';
import { useState } from 'react';

const CopyClipboardBtn = () => {
  const [copied, setCopied] = useState(false);
  const [address, setAddress] = useState<string | null>('');
  const { toast } = useToast();

  useEffect(() => {
    const addr = localStorage.getItem('walletAddress');
    setAddress(addr);
  }, []);

  const clipboardCopy = async () => {
    try {
      if (address) {
        await navigator.clipboard.writeText(address);
        setCopied(true);

        toast({
          title: 'Success!',
          description: 'Address successfully copied!',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard',
        variant: 'destructive',
      });
    }
  };
  return (
    <>
      <Button
        className="my-6 w-fit p-4 flex justify-center md:text-base bg-[#6067F9] hover:bg-[#3733CB] transition-all duration-350"
        onClick={clipboardCopy}
      >
        {address ? formatAddress(address) : ''}
      </Button>
    </>
  );
};

export default CopyClipboardBtn;
