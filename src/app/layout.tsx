import type { Metadata } from 'next';
import { IotaProvider } from './iotaprovider';
import '@iota/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noöm',
  description: 'NFT management with Noöm on IOTA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <IotaProvider>
        <body className={`antialiased`}>{children}</body>
      </IotaProvider>
    </html>
  );
}
