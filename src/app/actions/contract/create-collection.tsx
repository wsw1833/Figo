import { Transaction } from '@iota/iota-sdk/transactions';
import { Figo_NFT_PKG_ID } from '@/lib/constant';
import { getAdapter } from '@/misc/adapter';

export async function createCollectionNFT(
  name: string,
  description: string,
  url: string
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
      target: `${Figo_NFT_PKG_ID}::Figo_NFT::create_collection`,
      arguments: [
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
