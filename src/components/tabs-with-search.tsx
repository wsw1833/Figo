'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import IotaExplorer from '@images/Iota-logo.png';
import Image from 'next/image';
import { Badge } from './ui/badge';
import pinata from '@images/pinata.png';
import InventoryCard from './inventoryCard';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface parentNFTItem {
  objectID: string;
  name: string;
  description: string;
  image_url: string;
  component_type?: string;
  ipfs: string;
  equipped_on?: string;
  equipped_components?: string[];
}

interface componentNFTItem {
  objectID: string;
  name: string;
  description: string;
  image_url: string;
  component_type?: string;
  ipfs: string;
  equipped_on?: string;
  equipped_components?: string[];
}

type Item = parentNFTItem | componentNFTItem;

export default function TabsWithSearchGrid({
  ParentNFT,
  ComponentNFT,
}: {
  ParentNFT: parentNFTItem[];
  ComponentNFT: componentNFTItem[];
}) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<string>('collections');

  // Filter parentNFT based on search query
  const filteredParentNFTs = Array.isArray(ParentNFT)
    ? ParentNFT.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Filter componentNFT based on search query
  const filteredComponentNFTs = Array.isArray(ComponentNFT)
    ? ComponentNFT.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Tabs
      defaultValue="collections"
      className="w-full h-max flex flex-col items-center justify-center px-10"
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

      <TabsContent
        value="collections"
        className="w-full flex items-center justify-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 w-full">
          {filteredParentNFTs.map((parent) => (
            <MagicalCard
              key={parent.objectID}
              title={parent.name}
              description={parent.description}
              image={parent.image_url}
              tabs={activeTab}
              onClick={() => {
                setSelectedItem(parent);
                setIsSheetOpen(true);
              }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent
        value="accessories"
        className="w-full flex items-center justify-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 w-full">
          {filteredComponentNFTs.map((component) => (
            <MagicalCard
              key={component.objectID}
              title={component.name}
              description={component.description}
              image={component.image_url}
              tabs={activeTab}
              onClick={() => {
                setSelectedItem(component);
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
                <AccessorySheetContent
                  item={selectedItem}
                  parent={filteredParentNFTs}
                />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </Tabs>
  );
}

function CollectionSheetContent({ item }: { item: parentNFTItem }) {
  return (
    <>
      <SheetHeader>
        <div className="text-xs text-muted-foreground font-medium flex flex-row relative items-start gap-2 w-full h-fit">
          Molly
        </div>
        <SheetTitle className="text-xl font-bold flex relative items-start">
          {item.name}
        </SheetTitle>
        <SheetDescription className=" gap-2 flex flex-row w-max items-center justify-center">
          <Badge
            variant="outline"
            className="gap-1 p-1 w-fit flex flex-row items-center justify-center"
          >
            <Image src={Iota} alt="iota" className="w-4 h-4" />
            Iota
          </Badge>
          {item.objectID}
        </SheetDescription>
      </SheetHeader>
      <div className="py-6">
        <div className="h-60 w-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-4"></div>
        <h3 className="font-medium text-lg">Asset Description</h3>
        <p className="text-base mb-4 text-muted-foreground">
          {item.description}
        </p>
        <h3 className="font-medium text-lg my-2">NFT Inventory</h3>
        <div className="space-y-4">
          <InventoryCard
            imageSrc="/placeholder.svg?height=40&width=40"
            name="John Doe"
            title="Software Engineer"
            description="Frontend developer specializing in React and TypeScript"
          />
          <InventoryCard
            imageSrc="/placeholder.svg?height=40&width=40"
            name="Jane Smith"
            title="Product Designer"
            description="Creating beautiful and functional user interfaces"
          />
          <InventoryCard
            imageSrc="/placeholder.svg?height=40&width=40"
            name="Alex Johnson"
            title="Project Manager"
            description="Experienced in leading cross-functional teams and delivering complex projects on time and within budget"
          />
        </div>
      </div>
      <SheetFooter className="w-full gap-2">
        <Button
          className="w-full bg-[#4C52E2] hover:bg-[#3733CB]"
          onClick={() =>
            window.open(
              `https://green-elderly-sheep-310.mypinata.cloud/ipfs/${item.ipfs}`,
              '_blank'
            )
          }
        >
          Inspect IPFS on Pinata{' '}
          <Image src={pinata} alt="pinata IPFS" className="w-5 h-5" />
        </Button>
        <Button
          className="w-full bg-[#2D2D2DFF] hover:bg-[#0A0B12] text-[#F7F7F7]"
          onClick={() =>
            window.open(
              `https://iotascan.com/testnet/object/${item.objectID}`,
              '_blank'
            )
          }
        >
          Tx Details on Iota{' '}
          <Image src={IotaExplorer} alt="Iota explorer" className="w-5 h-5" />
        </Button>
      </SheetFooter>
    </>
  );
}

// Accessory Sheet Content
function AccessorySheetContent({
  item,
  parent,
}: {
  item: componentNFTItem;
  parent: parentNFTItem[];
}) {
  const [isEquipped, setIsEquipped] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    const newState = !isEquipped;
    setIsEquipped(newState);

    if (newState) {
      setIsDialogOpen(true);
    }
  };

  const handleCardSelect = ({
    parent,
    component,
  }: {
    parent: parentNFTItem;
    component: string;
  }) => {
    // Handle the card selection logic here and equip onto it
    if (parent.equipped_components?.includes(component))
      // if includes then unequip, else equip (parent.objectID, component.objectID);

      // Close the dialog after selection
      setIsDialogOpen(false);
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
            <Image src={Iota} alt="iota" className="w-4 h-4" />
            Iota
          </Badge>
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
          {item.component_type}
        </Badge>
      </div>
      <Button
        className={`${
          item.equipped_on
            ? 'w-full mb-2 bg-[#dd2d4a] hover:bg-[#ca0101]'
            : 'w-full mb-2 bg-[#4CABFFFF] hover:bg-[#0496ff]'
        }`}
        onClick={handleClick}
      >
        {item.equipped_on ? 'Unequip' : 'Equip'}
      </Button>
      {item.equipped_on ? (
        <SheetDescription className="font-light text-[#737373] mb-4">
          Equipped at Parent {item.objectID}
        </SheetDescription>
      ) : (
        <></>
      )}
      <SheetFooter className="w-full">
        <Button
          className="w-full bg-[#4C52E2] hover:bg-[#3733CB]"
          onClick={() =>
            window.open(
              `https://green-elderly-sheep-310.mypinata.cloud/ipfs/${item.ipfs}`,
              '_blank'
            )
          }
        >
          Inspect IPFS on Pinata{' '}
          <Image src={pinata} alt="pinata IPFS" className="w-5 h-5" />
        </Button>
        <Button
          className="w-full bg-[#2D2D2DFF] hover:bg-[#0A0B12] text-[#F7F7F7]"
          onClick={() =>
            window.open(
              `https://iotascan.com/testnet/object/${item.objectID}`,
              '_blank'
            )
          }
        >
          Tx Details on Iota{' '}
          <Image src={IotaExplorer} alt="Iota explorer" className="w-5 h-5" />
        </Button>
      </SheetFooter>

      <Dialog open={isEquipped && isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Choose a Collectible to Equip</DialogTitle>
            <DialogClose className="rounded-full hover:bg-muted p-2"></DialogClose>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-4">
            {parent.map((card) => (
              <MagicalCard
                key={card.objectID}
                title={card.name}
                image={`https://green-elderly-sheep-310.mypinata.cloud/ipfs/${card.image_url}`}
                description={card.description}
                tabs="accessories"
                onClick={() =>
                  handleCardSelect({ parent: card, component: item.objectID })
                }
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
