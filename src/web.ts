import { WebPlugin } from '@capacitor/core';
import { Trap } from 'ci-trap-web';

import type {
  CapacitorTrapPlugin,
  CollectorTypes,
  PermissionResult,
  TrapConfigurationType,
} from './definitions';

export class CapacitorTrapWeb extends WebPlugin implements CapacitorTrapPlugin {
  private trap: Trap | null = null;

  // eslint-disable-next-line
  async addCustomEvent(options: { event: any }): Promise<void> {
    const { event } = options;
    const trap = this.getTrap();
    trap.send(event);
  }

  // eslint-disable-next-line
  async addCustomMetadata(options: { key: string; value: any }): Promise<void> {
    const { key, value } = options;
    const trap = this.getTrap();
    trap.addCustomMetadata(key, value);
  }

  // eslint-disable-next-line
  async checkPermission(options: {
    collector: CollectorTypes;
  }): Promise<PermissionResult> {
    // For the currently implemented collectors no permission is required.
    return {
      result: true,
    };
  }

  async cleanUp(): Promise<void> {
    if (this.trap !== null) {
      await this.stop();
      this.trap = null;
    }
  }

  // eslint-disable-next-line
  async configure(options: { config: TrapConfigurationType }): Promise<void> {
    const { config } = options;
    const trap = new Trap();
    const reporter = config.reporter;

    trap.url(reporter.url.replace('/{sessionId}/{streamId}', ''));
    trap.enableCompression(reporter.compress);
    trap.apiKeyName(reporter.apiKeyName);
    trap.apiKeyValue(reporter.apiKeyValue);
    if (reporter.bufferSizeLimit !== null) {
      trap.bufferSizeLimit(reporter.bufferSizeLimit);
    }
    if (reporter.idleTimeout !== null) {
      trap.idleTimeout(reporter.idleTimeout);
    }
    if (reporter.bufferTimeout !== null) {
      trap.bufferTimeout(reporter.bufferTimeout);
    }

    this.trap = trap;
  }

  // eslint-disable-next-line
  async removeCustomMetadata(options: { key: string }): Promise<void> {
    const { key } = options;
    const trap = this.getTrap();
    trap.removeCustomMetadata(key);
  }

  // eslint-disable-next-line
  async requestPermission(options: {
    collector: CollectorTypes;
  }): Promise<void> {
    // For the currently implemented collectors no permission is required.
  }

  async start(): Promise<void> {
    const trap = this.getTrap();
    trap.mount(document);
    trap.start();
  }

  async stop(): Promise<void> {
    const trap = this.getTrap();
    trap.stop();
    trap.umount(document);
  }

  getTrap(): Trap {
    if (this.trap === null) {
      throw new Error('Trap is not initialized');
    }
    return this.trap;
  }
}
