import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.sle8p.app",
  appName: "Sle8p",
  webDir: ".next",
  server: {
    androidScheme: "https",
    iosScheme: "sle8p",
  },
  ios: {
    contentInset: "never",
    backgroundColor: "#05050A",
    preferredContentMode: "mobile",
    scheme: "sle8p",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: "#05050A",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: true,
      style: "DARK",
      backgroundColor: "#05050A",
    },
  },
};

export default config;
