'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MagicCard } from './magicui/magic-card';
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
import IotaExplorer from '@images/Iota-logo.png';
import Image from 'next/image';
import { Badge } from './ui/badge';
import pinata from '@images/pinata.png';

// Sample data for collections and accessories
const collectionsData = [
  { id: 1, title: 'Summer Collection', description: 'Latest summer styles' },
  { id: 2, title: 'Winter Collection', description: 'Cozy winter wear' },
  { id: 3, title: 'Spring Collection', description: 'Fresh spring designs' },
  { id: 4, title: 'Fall Collection', description: 'Autumn fashion essentials' },
  { id: 5, title: 'Limited Edition', description: 'Exclusive limited items' },
  { id: 6, title: 'Casual Collection', description: 'Everyday casual wear' },
  { id: 7, title: 'Formal Collection', description: 'Elegant formal attire' },
  {
    id: 8,
    title: 'Sports Collection',
    description: 'Athletic performance wear',
  },
];

const accessoriesData = [
  { id: 1, title: 'Watches', description: 'Premium timepieces' },
  { id: 2, title: 'Jewelry', description: 'Elegant accessories' },
  { id: 3, title: 'Bags', description: 'Stylish handbags and backpacks' },
  { id: 4, title: 'Sunglasses', description: 'Designer eyewear' },
  { id: 5, title: 'Belts', description: 'Quality leather belts' },
  { id: 6, title: 'Hats', description: 'Trendy headwear' },
];

interface CollectionItem {
  id: number;
  title: string;
  description: string;
}

interface AccessoryItem {
  id: number;
  title: string;
  description: string;
}

type Item = CollectionItem | AccessoryItem;

export default function TabsWithSearchGrid() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<string>('collections');

  // Filter collections based on search query
  const filteredCollections = collectionsData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter accessories based on search query
  const filteredAccessories = accessoriesData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Tabs
      defaultValue="collections"
      className="w-full h-max flex flex-col items-center justify-center"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="h-max bg-[#F7F7F7]">
        <TabsTrigger value="collections" className="sm:px-20 px-10 text-base">
          Collections
        </TabsTrigger>
        <TabsTrigger value="accessories" className="sm:px-20 px-10 text-base">
          Accessories
        </TabsTrigger>
      </TabsList>

      <div className="relative w-full max-w-md my-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search..."
          className="pl-10 focus-visible:ring-[#6067F9] hover:ring-1 ring-[#6067F9] transition-all duration-350"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TabsContent value="collections" className="w-full ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {filteredCollections.map((collection) => (
            <MagicalCard
              key={collection.id}
              title={collection.title}
              description={collection.description}
              tabs={activeTab}
              onClick={() => {
                setSelectedItem(collection);
                setIsSheetOpen(true);
              }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="accessories" className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {filteredAccessories.map((accessory) => (
            <MagicalCard
              key={accessory.id}
              title={accessory.title}
              description={accessory.description}
              tabs={activeTab}
              onClick={() => {
                setSelectedItem(accessory);
                setIsSheetOpen(true);
              }}
            />
          ))}
        </div>
      </TabsContent>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedItem && (
            <>
              {activeTab === 'collections' ? (
                <CollectionSheetContent item={selectedItem} />
              ) : (
                <AccessorySheetContent item={selectedItem} />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </Tabs>
  );
}

// Magic Card component with hover effects
function MagicalCard({
  title,
  description,
  onClick,
  tabs,
}: {
  title: string;
  description: string;
  onClick?: () => void;
  tabs: string;
}) {
  return (
    <Card className="overflow-hidden group md:mx-4" onClick={onClick}>
      <MagicCard>
        {tabs === 'collections' ? (
          <div className="h-60 bg-gradient-to-br from-purple-400 to-pink-500 "></div>
        ) : (
          <div className="h-60 w-full bg-gradient-to-br from-blue-400 to-teal-500 rounded-lg"></div>
        )}

        <CardHeader className="p-4">
          <div className="text-xs text-muted-foreground font-medium flex flex-row relative items-center justify-between w-full ">
            {title} <Image src={Iota} alt="iota" className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-[5rem]">
          <CardTitle className="text-lg text-[#0A0B12] relative flex">
            {description}
          </CardTitle>
          <p className="text-sm text-[#0A0B12] mt-1">#tokenID</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-muted-foreground">
            Click to view details
          </div>
        </CardFooter>
      </MagicCard>
    </Card>
  );
}

function CollectionSheetContent({ item }: { item: CollectionItem }) {
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
            <Image src={Iota} alt="iota" className="w-4 h-4" />
            Iota
          </Badge>
          Token #1234
        </SheetDescription>
      </SheetHeader>
      <div className="py-6">
        <div className="h-60 w-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-4"></div>
        <h3 className="font-medium text-lg">Asset Description</h3>
        <p className="text-base mb-4">{item.description}</p>
        <h3 className="font-medium text-lg">NFT Inventory</h3>
        <div className="w-full h-10 border-2 my-2 rounded-[12px] border-black">
          body
        </div>
        <div className="w-full h-10 border-2 my-2 rounded-[12px] border-black">
          weapon
        </div>
        <div className="w-full h-10 border-2 my-2 rounded-[12px] border-black">
          boots
        </div>
        <div className="space-y-4"></div>
      </div>
      <SheetFooter className="w-full gap-2">
        <Button className="w-full bg-[#4C52E2] hover:bg-[#3733CB]">
          Inspect IPFS on Pinata{' '}
          <Image src={pinata} alt="pinata IPFS" className="w-5 h-5" />
        </Button>
        <Button className="w-full bg-[#2D2D2DFF] hover:bg-[#0A0B12] text-[#F7F7F7]">
          Tx Details on Iota{' '}
          <Image src={IotaExplorer} alt="Iota explorer" className="w-5 h-5" />
        </Button>
      </SheetFooter>
    </>
  );
}

// Accessory Sheet Content
function AccessorySheetContent({ item }: { item: AccessoryItem }) {
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
            <Image src={Iota} alt="iota" className="w-4 h-4" />
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
      <Button
        className={`${
          isEquipped
            ? 'w-full mb-2 bg-[#dd2d4a] hover:bg-[#ca0101]'
            : 'w-full mb-2 bg-[#4CABFFFF] hover:bg-[#0496ff]'
        }`}
        onClick={handleClick}
      >
        {isEquipped ? 'Unequip' : 'Equip'}
      </Button>
      <SheetDescription className="font-light text-[#737373] mb-4">
        If equipped then change to unequip and Equipped at Link tokenID
      </SheetDescription>
      <SheetFooter className="w-full">
        <Button className="w-full bg-[#4C52E2] hover:bg-[#3733CB]">
          Inspect IPFS on Pinata{' '}
          <Image src={pinata} alt="pinata IPFS" className="w-5 h-5" />
        </Button>
        <Button className="w-full bg-[#2D2D2DFF] hover:bg-[#0A0B12] text-[#F7F7F7]">
          Tx Details on Iota{' '}
          <Image src={IotaExplorer} alt="Iota explorer" className="w-5 h-5" />
        </Button>
      </SheetFooter>
    </>
  );
}
