import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { formatAddress } from '@/lib/utils';

const copyClipboardBtn = () => {
  const ethereumAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const clipboardCopy = async () => {
    try {
      await navigator.clipboard.writeText(ethereumAddress);
      setCopied(true);

      toast({
        title: 'Success!',
        description: 'Address successfully copied!',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard',
        variant: 'destructive',
      });
    }
  };
  return (
    <Button
      className="my-6 w-fit p-4 flex justify-center md:text-base bg-[#6067F9] hover:bg-[#3733CB] transition-all duration-350"
      onClick={clipboardCopy}
    >
      {formatAddress(ethereumAddress)}
    </Button>
  );
};

export default copyClipboardBtn;
