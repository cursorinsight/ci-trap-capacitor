import { WebPlugin } from '@capacitor/core';

import type { CapacitorTrapPlugin } from './definitions';

export class CapacitorTrapWeb extends WebPlugin implements CapacitorTrapPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
