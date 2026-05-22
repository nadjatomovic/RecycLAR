import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
  municipality?: string; // ← Додадено за да знаеме која општина да ја пратиме на мапата
};

const TABS: { label: string; icon: string; route: Route }[] = [
  { label: "Domov", icon: "⌂", route: "Dashboard" },
  { label: "Skeniraj", icon: "⌗", route: "Scanner" },
  { label: "Kviz", icon: "?", route: "Quiz" },
  { label: "Zemljevid", icon: "⌖", route: "Map" }, // ← Додадена Мапата тука!
  { label: "Profil", icon: "👤", route: "Profile" },
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
        return (
          <TouchableOpacity
            key={tab.route}
            style={s.item}
            onPress={() => {
              if (active) return;
              if (tab.route === "Map") {
                // Кога клика на мапа, ја префрламе и општината
                navigation.navigate("Map", {
                  municipality: municipality || "Maribor",
                });
              } else {
                navigation.navigate(tab.route);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={[s.icon, active && s.activeColor]}>{tab.icon}</Text>
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
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EFEFF4",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
    color: "#6B35C9", // vijolicna
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: "#7A7A86",
  },
  activeColor: {
    color: "#35A936", // zelena кога е активно
    fontWeight: "700",
  },
});
