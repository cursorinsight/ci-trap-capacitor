import { WebPlugin } from '@capacitor/core';

import type {
  CapacitorTrapPlugin,
  CollectorTypes,
  PermissionResult,
  TrapConfigurationType,
} from './definitions';

export class CapacitorTrapWeb extends WebPlugin implements CapacitorTrapPlugin {
  // eslint-disable-next-line
  addCustomEvent(options: { event: any }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line
  addCustomMetadata(options: { key: string; value: any }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line
  checkPermission(options: {
    collector: CollectorTypes;
  }): Promise<PermissionResult> {
    throw new Error('Method not implemented.');
  }

  cleanUp(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line
  configure(options: { config: TrapConfigurationType }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line
  removeCustomMetadata(options: { key: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line
  requestPermission(options: { collector: CollectorTypes }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  start(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  stop(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
