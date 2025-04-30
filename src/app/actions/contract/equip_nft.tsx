import { Transaction } from '@iota/iota-sdk/transactions';
import { Figo_NFT_PKG_ID } from '@/lib/constant';
import { getAdapter } from '@/misc/adapter';

export async function equipNFT(parent: string, component: string) {
  const adapter = await getAdapter();
  const account = await adapter.getAccounts();
  const txb = () => {
    const tx = new Transaction();
    tx.setGasBudget(50000000);
    tx.moveCall({
      target: `${Figo_NFT_PKG_ID}::Figo_NFT::equip_component`,
      arguments: [tx.object(parent), tx.object(component)],
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
