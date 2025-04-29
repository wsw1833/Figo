import { NightlyConnectIotaAdapter } from '@nightlylabs/wallet-selector-iota';

let _adapter: NightlyConnectIotaAdapter | undefined;
export const getAdapter = async (persisted = true) => {
  if (_adapter) return _adapter;
  _adapter = await NightlyConnectIotaAdapter.build({
    appMetadata: {
      name: 'Figo on Iota',
      description: 'Phygital Asset Collection Management DApp on Iota',
      icon: 'https://docs.nightly.app/img/logo.png',
    },
    persistent: persisted,
  });
  return _adapter;
};
