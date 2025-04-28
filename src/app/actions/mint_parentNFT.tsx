import { Transaction } from '@iota/iota-sdk/transactions';
import { Figo_NFT_PKG_ID } from '@/lib/constant';
import { IotaClient } from '@iota/iota-sdk/client';

export function mintParentNFT(
  collection: any,
  name: string,
  description: string,
  uri: string,
  signAndExecuteTransaction: any,
  client: IotaClient
) {
  const txb = () => {
    const tx = new Transaction();
    const nameBytes = Array.from(new TextEncoder().encode(name));
    const descriptionBytes = Array.from(new TextEncoder().encode(description));
    const urlBytes = Array.from(new TextEncoder().encode(uri));
    tx.setGasBudget(50000000);
    tx.moveCall({
      target: `${Figo_NFT_PKG_ID}::Figo_NFT::mint_parent_nft`,
      arguments: [
        tx.object(collection),
        tx.pure.vector('u8', nameBytes),
        tx.pure.vector('u8', descriptionBytes),
        tx.pure.vector('u8', urlBytes),
      ],
    });
    return tx;
  };
  signAndExecuteTransaction(
    {
      transaction: txb(),
    },
    {
      onSuccess: ({ digest }: { digest: string }) => {
        client.waitForTransaction({ digest, options: { showEffects: true } });
      },

      onError: (error: Error) => {
        console.error('Failed to execute transaction', txb, error);
      },
    }
  );
}
