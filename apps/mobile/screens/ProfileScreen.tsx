import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/ProfileScreen.styles";

const stats = [
  {
    label: "Eko točke",
    value: "1240",
    icon: "♧",
    color: "#35A936",
  },
  {
    label: "Skeniranja",
    value: "48",
    icon: "⌗",
    color: "#6B35C9",
  },
  {
    label: "Pravilni kvizi",
    value: "36",
    icon: "♕",
    color: "#35A936",
  },
  {
    label: "Streak",
    value: "6 dni",
    icon: "♨",
    color: "#6B35C9",
  },
];

const achievements = [
  {
    title: "Eko junak",
    description: "Zberi 1000 eko točk",
    image: require("../assets/bin-green.png"),
    ribbon: "EKO JUNAK",
  },
  {
    title: "Varuh planeta",
    description: "Skeniraj 30 različnih odpadkov",
    image: require("../assets/icon-logo.png"),
    ribbon: "VARUH PLANETA",
  },
  {
    title: "Plastika? Ne!",
    description: "Skeniraj 20 plastenk",
    image: require("../assets/plastic-bottle.png"),
    ribbon: "PLASTIKA? NE!",
  },
];

const activities = [
  {
    title: "Skeniran odpadek",
    description: "Plastenka PET",
    points: "+15 točk",
    time: "Danes, 09:15",
    image: require("../assets/plastic-bottle.png"),
  },
  {
    title: "Zaključen kviz",
    description: "Ločevanje odpadkov – Nivo 1",
    points: "+10 točk",
    time: "Danes, 08:42",
    image: require("../assets/icon-logo.png"),
  },
  {
    title: "Eko točke za aktivnost",
    description: "Dnevni bonus",
    points: "+5 točk",
    time: "Včeraj, 20:10",
    image: require("../assets/glass-bottle.png"),
  },
];

export default function ProfileScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image
              source={require("../assets/icon-logo.png")}
              style={styles.brandIcon}
              resizeMode="contain"
            />

            <Text style={styles.brandText}>
              <Text style={styles.brandGreen}>Recyc</Text>
              <Text style={styles.brandPurple}>LAR</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
            <Text style={styles.notificationText}>⌕</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <Text style={styles.screenTitle}>Profil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/lari-hello.png")}
              style={styles.avatar}
              resizeMode="contain"
            />

            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
              <Text style={styles.cameraBadgeText}>▣</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Nadja</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileMetaRow}>
              <View style={styles.metaBlock}>
                <Text style={styles.metaIcon}>⌖</Text>
                <View>
                  <Text style={styles.metaLabel}>Občina</Text>
                  <Text style={styles.metaValue}>Maribor</Text>
                </View>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.metaBlock}>
                <Text style={styles.metaIcon}>⌂</Text>
                <View>
                  <Text style={styles.metaLabel}>Skupina</Text>
                  <Text style={styles.metaValue}>7.B</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Text style={[styles.statIcon, { color: item.color }]}>
                  {item.icon}
                </Text>
              </View>

              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={[styles.statValue, { color: item.color }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosežki</Text>

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.achievementsRow}>
            {achievements.map((achievement) => (
              <View key={achievement.title} style={styles.achievementItem}>
                <View style={styles.achievementBadge}>
                  <Image
                    source={achievement.image}
                    style={styles.achievementImage}
                    resizeMode="contain"
                  />

                  <View style={styles.ribbon}>
                    <Text style={styles.ribbonText}>{achievement.ribbon}</Text>
                  </View>
                </View>

                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Zadnja aktivnost</Text>

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          {activities.map((activity, index) => (
            <View key={activity.title}>
              <View style={styles.activityRow}>
                <View style={styles.activityIconWrap}>
                  <Image
                    source={activity.image}
                    style={styles.activityIcon}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.activityTextWrap}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                </View>

                <View style={styles.activityRight}>
                  <Text style={styles.activityPoints}>{activity.points}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>

              {index < activities.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomTab}>
        <TabItem
          label="Domov"
          icon="⌂"
          onPress={() => navigation.navigate("Dashboard")}
        />
        <TabItem label="Skeniraj" icon="⌗" />
        <TabItem label="Kviz" icon="?" />
        <TabItem label="Lestvica" icon="♕" />
        <TabItem label="Profil" icon="♙" active />
      </View>
    </SafeAreaView>
  );
}

const TabItem = ({ label, icon, active, onPress }: any) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);