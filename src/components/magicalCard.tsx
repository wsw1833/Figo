'use client';

import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  CardHeader,
} from './ui/card';
import { MagicCard } from './magicui/magic-card';
import Iota from '@images/Iota-circle.svg';

import Image from 'next/image';

export default function MagicalCard({
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
