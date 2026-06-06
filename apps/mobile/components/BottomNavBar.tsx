import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Route =
  | "Dashboard"
  | "Scanner"
  | "Quiz"
  | "Leaderboard"
  | "Profile"
  | "Map";

type Props = {
  navigation: any;
  activeRoute: Route;
  municipality?: string;
};

type Tab =
  | {
      label: string;
      iconSet: "Ionicons";
      icon: keyof typeof Ionicons.glyphMap;
      activeIcon: keyof typeof Ionicons.glyphMap;
      route: Route;
    }
  | {
      label: string;
      iconSet: "MaterialIcons";
      icon: keyof typeof MaterialIcons.glyphMap;
      activeIcon: keyof typeof MaterialIcons.glyphMap;
      route: Route;
    };

const TABS: Tab[] = [
  {
    label: "Domov",
    iconSet: "Ionicons",
    icon: "home-outline",
    activeIcon: "home",
    route: "Dashboard",
  },
  {
    label: "Kviz",
    iconSet: "MaterialIcons",
    icon: "quiz",
    activeIcon: "quiz",
    route: "Quiz",
  },
  {
    label: "Skeniraj",
    iconSet: "Ionicons",
    icon: "camera-outline",
    activeIcon: "camera",
    route: "Scanner",
  },
  {
    label: "Zemljevid",
    iconSet: "Ionicons",
    icon: "map-outline",
    activeIcon: "map",
    route: "Map",
  },
  {
    label: "Profil",
    iconSet: "Ionicons",
    icon: "person-outline",
    activeIcon: "person",
    route: "Profile",
  },
];

export default function BottomNavBar({
  navigation,
  activeRoute,
  municipality,
}: Props) {
  return (
    <View style={s.bar}>
      {TABS.map((tab) => {
        const active = tab.route === activeRoute;
        const isScanner = tab.route === "Scanner";

        if (isScanner) {
          return (
            <TouchableOpacity
              key={tab.route}
              style={s.scannerItem}
              onPress={() => {
                if (active) return;
                navigation.navigate(tab.route);
              }}
              activeOpacity={0.8}
            >
              <View style={[s.scannerCircle, active && s.scannerCircleActive]}>
                <Ionicons name="camera" size={28} color="#FFFFFF" />
              </View>

              <Text style={[s.label, s.scannerLabel, active && s.activeColor]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.route}
            style={s.item}
            onPress={() => {
              if (active) return;

              if (tab.route === "Map") {
                navigation.navigate("Map", {
                  municipality: municipality || "Maribor",
                });
              } else {
                navigation.navigate(tab.route);
              }
            }}
            activeOpacity={0.7}
          >
            {tab.iconSet === "MaterialIcons" ? (
              <MaterialIcons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? "#35A936" : "#7A7A86"}
                style={s.icon}
              />
            ) : (
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? "#35A936" : "#7A7A86"}
                style={s.icon}
              />
            )}

            <Text style={[s.label, active && s.activeColor]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 24 : 16,
    height: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },

    elevation: 8,
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: 4,
  },

  scannerItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -14,
  },

  scannerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6B35C9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6B35C9",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 2,
  },

  scannerCircleActive: {
    backgroundColor: "#35A936",
    shadowColor: "#35A936",
  },

  icon: {
    marginBottom: 3,
  },

  label: {
    fontSize: 10,
    color: "#7A7A86",
    fontWeight: "500",
  },

  scannerLabel: {
    top: 3,
  },

  activeColor: {
    color: "#35A936",
    fontWeight: "700",
  },
});