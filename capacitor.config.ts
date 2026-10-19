/// <reference types="@capacitor-firebase/authentication" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.jonnyramen.japaninfojobs',
  appName: 'Japan Info Jobs',
  webDir: 'www',

  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: [
        'facebook.com',
        'google.com'
      ]
    }
  }
};

export default config;