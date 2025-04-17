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

export default function TabsWithSearchGrid() {
  const [searchQuery, setSearchQuery] = useState('');

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
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Magic Card component with hover effects
function MagicalCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden group mx-4">
      <MagicCard>
        <div className="h-60 bg-gradient-to-br from-purple-400 to-pink-500 "></div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground">{description}</p>
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
