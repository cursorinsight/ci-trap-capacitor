import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cursorinsight.trap.capacitor.CapacitorExample',
  appName: 'Capacitor Trap Example',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
