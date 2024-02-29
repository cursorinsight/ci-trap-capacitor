import { registerPlugin } from '@capacitor/core';

import type { CapacitorTrapPlugin } from './definitions';

const CapacitorTrap = registerPlugin<CapacitorTrapPlugin>('CapacitorTrap', {
  web: () => import('./web').then(m => new m.CapacitorTrapWeb()),
});

export * from './definitions';
export { TrapConfig } from './config';
export { CapacitorTrap };