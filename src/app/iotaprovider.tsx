'use client';
import { IotaClientProvider, WalletProvider } from '@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
};

const queryClient = new QueryClient();

export const IotaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>{children}</WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
};
