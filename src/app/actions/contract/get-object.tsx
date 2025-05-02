'use server';

export async function getObjectDigest(client: any, txid: string) {
  const res = await client.getTransactionBlock({
    txid,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  const createdObjects = res.objectChanges?.filter(
    (change: any) => change.type === 'created'
  );
  const createdObjectIds = createdObjects?.map((obj: any) => obj.objectId);

  return createdObjectIds;
}
