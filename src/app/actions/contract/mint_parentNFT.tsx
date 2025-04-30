import { Transaction } from '@iota/iota-sdk/transactions';
import { Figo_NFT_PKG_ID } from '@/lib/constant';
import { getAdapter } from '@/misc/adapter';

export async function mintParentNFT(
  collection: any,
  name: string | undefined,
  description: string | undefined,
  url: string | undefined
) {
  const adapter = await getAdapter();
  const account = await adapter.getAccounts();
  const txb = () => {
    const tx = new Transaction();
    const nameBytes = Array.from(new TextEncoder().encode(name));
    const descriptionBytes = Array.from(new TextEncoder().encode(description));
    const urlBytes = Array.from(new TextEncoder().encode(url));
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
  const txid = await adapter.signAndExecuteTransaction({
    transaction: txb(),
    chain: 'iota:testnet',
    account: account[0],
  });
  return txid;
}
