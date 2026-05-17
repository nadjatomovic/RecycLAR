import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Route = "Dashboard" | "Scanner" | "Quiz" | "Leaderboard" | "Profile";

type Props = {
  navigation: any;
  activeRoute: Route;
};

const TABS: { label: string; icon: string; route: Route }[] = [
  { label: "Domov",    icon: "⌂",  route: "Dashboard" },
  { label: "Skeniraj", icon: "⌗",  route: "Scanner" },
  { label: "Kviz",     icon: "?",  route: "Quiz" },
  { label: "Lestvica", icon: "🏆", route: "Leaderboard" },
  { label: "Profil",   icon: "👤", route: "Profile" },
];

export default function BottomNavBar({ navigation, activeRoute }: Props) {
  return (
    <View style={s.bar}>
      {TABS.map((tab) => {
        const active = tab.route === activeRoute;
        return (
          <TouchableOpacity
            key={tab.route}
            style={s.item}
            onPress={() => !active && navigation.navigate(tab.route)}
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

const s = {
  bar:         { flexDirection: "row" as const, backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  item:        { flex: 1, alignItems: "center" as const },
  icon:        { fontSize: 20, color: "#9CA3AF" },
  label:       { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
  activeColor: { color: "#22C55E" },
};
