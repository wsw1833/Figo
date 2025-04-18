'use client';

import * as React from 'react';
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

export function Header({ uid }: { uid: string }): JSX.Element {
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
                >
                  Scan
                  <Image src={nightly} alt="logo" className="w-6 h-6" />
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
                      Please place the device close to the Noöm.
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
                  href={`/${uid}/main`}
                  title="Profile"
                  icon={<User className="h-4 w-4" />}
                >
                  Manage your NFT collection.
                </ListItem>
                <ListItem
                  href="/"
                  title="Logout"
                  icon={<LogOut className="h-4 w-4" />}
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
