'use client';

import { useState } from 'react';
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
import Iota from '@images/Iota-circle.svg';
import Image from 'next/image';
import { Badge } from './ui/badge';
import pinata from '@images/pinata.png';

const itemsData = [
  {
    id: 1,
    title: 'Summer Collection',
    description: 'Latest summer styles',
  },
  {
    id: 2,
    title: 'Winter Collection',
    description: 'Cozy winter wear',
  },
  {
    id: 3,
    title: 'Spring Collection',
    description: 'Fresh spring designs',
  },
  {
    id: 4,
    title: 'Fall Collection',
    description: 'Autumn fashion essentials',
  },
  {
    id: 5,
    title: 'Limited Edition',
    description: 'Exclusive limited items',
  },
  {
    id: 6,
    title: 'Casual Collection',
    description: 'Everyday casual wear',
  },
  {
    id: 7,
    title: 'Formal Collection',
    description: 'Elegant formal attire',
  },
  {
    id: 8,
    title: 'Sports Collection',
    description: 'Athletic performance wear',
  },
  {
    id: 9,
    title: 'Watches',
    description: 'Premium timepieces',
  },
  {
    id: 10,
    title: 'Jewelry',
    description: 'Elegant accessories',
  },
  {
    id: 11,
    title: 'Bags',
    description: 'Stylish handbags and backpacks',
  },
  {
    id: 12,
    title: 'Sunglasses',
    description: 'Designer eyewear',
  },
];

interface Item {
  id: number;
  title: string;
  description: string;
}

export default function SearchGrid() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Filter items based on search query
  const filteredItems = itemsData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            title={item.title}
            description={item.description}
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
              <SheetDisplay item={selectedItem} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SheetDisplay({ item }: { item: Item }) {
  const [isEquipped, setIsEquipped] = useState(false);

  const handleClick = () => {
    const newState = !isEquipped;
    setIsEquipped(newState);
  };

  return (
    <>
      <SheetHeader>
        <div className="text-xs text-muted-foreground font-medium flex flex-row relative items-start gap-2 w-full h-fit">
          {item.title}
        </div>
        <SheetTitle className="text-xl font-bold flex relative items-start">
          {item.title}
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
          Token #1234
        </SheetDescription>
      </SheetHeader>
      <div className="py-6">
        <div className="h-60 w-full bg-gradient-to-br from-blue-400 to-teal-500 rounded-lg mb-4"></div>
        <h3 className="font-medium text-lg">Asset Description</h3>
        <p className="text-base mb-4">{item.description}</p>
        <div className="space-y-4"></div>
        <h3 className="font-medium text-lg my-1">Accessories Type</h3>
        <Badge
          variant="outline"
          className="p-1 w-fit border-2 border-[#4C52E2] text-[#4C52E2] font-medium"
        >
          Weapon
        </Badge>
      </div>
      <SheetFooter className="w-full">
        <Button className="w-full bg-[#4C52E2] hover:bg-[#3733CB]">
          Inspect IPFS on Pinata{' '}
          <Image
            src={pinata || '/placeholder.svg'}
            alt="pinata IPFS"
            className="w-5 h-5"
          />
        </Button>
      </SheetFooter>
    </>
  );
}
