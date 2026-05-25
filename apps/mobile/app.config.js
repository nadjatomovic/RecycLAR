import "dotenv/config";

export default {
  expo: {
    name: "RecycLAR",
    slug: "recyclar",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    icon: "./assets/icon-logo.png",

    splash: {
      image: "./assets/icon-logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.recyclar.app",
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon-logo.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.recyclar.app",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },

    web: {
      favicon: "./assets/icon-logo.png",
    },

    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow RecycLAR to access your camera.",
        },
      ],
      "expo-dev-client",
      "react-native-fast-tflite",
      "expo-asset",
      "expo-font",
    ],

    extra: {
      eas: {
        projectId: "cbd0db3f-db68-4894-9b1c-999197f5c796",
      },
    },

    owner: "ljupka",
  },
};