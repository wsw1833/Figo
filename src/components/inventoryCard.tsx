'use client';

import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from './ui/dropdown-menu';

interface CardProps {
  imageSrc: string;
  name: string;
  title: string;
  description: string;
  alt?: string;
}

export default function InventoryCard({
  imageSrc,
  name,
  title,
  description,
  alt = 'NFT Inventory image',
}: CardProps) {
  const onViewDetails = () => console.log(`View details for ${name}`);
  const onUnequip = () => console.log(`Unequip ${name}`);
  return (
    <div className="flex items-center p-3 mb-4 rounded-[16px] border border-gray-200 bg-white shadow-sm">
      <div className="flex-shrink-0 mr-4">
        <div className="h-14 w-14 rounded-[16px] overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc || '/placeholder.svg'}
              alt={alt}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-xs text-gray-400 line-clamp-1">{description}</p>
      </div>

      <div className="flex-shrink-0 ml-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-blue-500 hover:bg-blue-50 rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 p-0" align="end">
            <DropdownMenuItem
              className="flex items-center px-3 py-2 text-sm cursor-pointer"
              onClick={onViewDetails}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center px-3 py-2 text-sm text-red-500 cursor-pointer"
              onClick={onUnequip}
            >
              Unequip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
