import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/DashboardScreen.styles";

const DashboardScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.miniLogoRow}>
          <Image
            source={require("../assets/icon-logo.png")}
            style={styles.miniIcon}
          />
          <Image
            source={require("../assets/logo.png")}
            style={styles.miniLogoText}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Pozdravljeni!</Text>
          <Text style={styles.welcomeSub}>
            Pripravljeni ste za hitro ločevanje odpadkov.
          </Text>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationIconBg}>
            <Text style={{ fontSize: 20 }}>📍</Text>
          </View>
          <View>
            <Text style={styles.locationLabel}>Izbrana občina</Text>
            <Text style={styles.locationName}>Maribor</Text>
            {/* Ова копче те враќа назад за промена на општина */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.changeLocation}>Spremeni občino {">"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mascotSection}>
          <Image
            source={require("../assets/lari-hello.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.scanButton} activeOpacity={0.9}>
          <View style={styles.row}>
            <Text style={styles.camIcon}>📷</Text>
            <Text style={styles.scanButtonText}>Začni skeniranje</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.binsSection}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <BinItem img={require("../assets/bin-yellow.png")} label="Rumeni" />
            <BinItem img={require("../assets/bin-blue.png")} label="Modri" />
            <BinItem img={require("../assets/bin-green.png")} label="Zeleni" />
            <BinItem img={require("../assets/bin-brown.png")} label="Rjavi" />
            <BinItem img={require("../assets/bin-black.png")} label="Mešani" />
          </ScrollView>
        </View>
      </ScrollView>

      {/* Долното мени (Bottom Bar) */}
      <View style={styles.bottomTab}>
        <TabItem label="Domov" icon="🏠" active={true} />
        <TabItem label="Skeniraj" icon="🔍" />
        {/* ОВДЕ Е ПОПРАВКАТА: Клик на Občina те носи на мапата */}
        <TabItem
          label="Občina"
          icon="📍"
          onPress={() => navigation.navigate("Map")}
        />
      </View>
    </SafeAreaView>
  );
};

const BinItem = ({ img, label }: any) => (
  <View style={styles.binItem}>
    <Image source={img} style={styles.binImg} resizeMode="contain" />
    <Text style={styles.binLabel}>{label}</Text>
  </View>
);

const TabItem = ({ label, icon, active, onPress }: any) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Text style={[styles.tabIcon, active && { color: "#4CAF50" }]}>{icon}</Text>
    <Text
      style={[
        styles.tabLabel,
        active && { color: "#4CAF50", fontWeight: "bold" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default DashboardScreen;
