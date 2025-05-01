import type { Metadata } from 'next';
import { IotaProvider } from './iotaprovider';
import '@iota/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Figo',
  description: 'NFC-Powered Phygital Asset NFT Management with Figo on IOTA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <IotaProvider>
        <body className={`antialiased`}>{children}</body>
      </IotaProvider>
    </html>
  );
}
