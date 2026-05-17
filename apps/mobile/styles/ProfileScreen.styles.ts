import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const colors = {
  green: "#35A936",
  purple: "#6B35C9",
  purpleLight: "#EFE8FF",
  greenLight: "#EAF7E7",
  text: "#252733",
  muted: "#7A7A86",
  border: "#ECECF2",
  white: "#FFFFFF",
  bg: "#F8FAF5",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 112,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 44,
    height: 44,
    marginRight: 10,
  },

  brandText: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  brandGreen: {
    color: colors.green,
  },

  brandPurple: {
    color: colors.purple,
  },

  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: "relative",
  },

  notificationText: {
    fontSize: 23,
    color: "#4D4D59",
  },

  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purple,
  },

  screenTitle: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 18,
  },

  profileCard: {
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    marginBottom: 18,
  },

  avatarWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    position: "relative",
  },

  avatar: {
    width: 98,
    height: 98,
  },

  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },

  cameraBadgeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  profileInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  name: {
    fontSize: 31,
    fontWeight: "900",
    color: colors.text,
    marginRight: 10,
  },

  editIcon: {
    fontSize: 22,
    color: colors.purple,
    fontWeight: "900",
  },

  profileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  metaIcon: {
    fontSize: 30,
    color: colors.purple,
    marginRight: 8,
  },

  metaLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 2,
  },

  metaValue: {
    fontSize: 17,
    color: colors.purple,
    fontWeight: "900",
  },

  metaDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    width: (width - 62) / 4,
    minHeight: 126,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  statIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F3F1FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  statIcon: {
    fontSize: 26,
    fontWeight: "900",
  },

  statLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
    marginBottom: 7,
    fontWeight: "600",
  },

  statValue: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  sectionCard: {
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
  },

  viewAll: {
    fontSize: 14,
    color: colors.purple,
    fontWeight: "800",
  },

  achievementsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  achievementItem: {
    width: "31%",
    alignItems: "center",
  },

  achievementBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F5F1FF",
    borderWidth: 2,
    borderColor: "#D8C8F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },

  achievementImage: {
    width: 62,
    height: 62,
  },

  ribbon: {
    position: "absolute",
    bottom: -18,
    backgroundColor: colors.purple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 82,
    alignItems: "center",
  },

  ribbonText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "900",
  },

  achievementTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },

  achievementDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.muted,
    textAlign: "center",
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  activityIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F4FBF3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  activityIcon: {
    width: 36,
    height: 36,
  },

  activityTextWrap: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 3,
  },

  activityDescription: {
    fontSize: 13,
    color: colors.muted,
  },

  activityRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  activityPoints: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.green,
    marginBottom: 4,
  },

  activityTime: {
    fontSize: 11,
    color: colors.muted,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 66,
  },

  bottomTab: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    backgroundColor: colors.white,
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
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabIcon: {
    fontSize: 25,
    color: colors.purple,
    marginBottom: 2,
  },

  tabIconActive: {
    color: colors.green,
  },

  tabLabel: {
    fontSize: 12,
    color: colors.muted,
  },

  tabLabelActive: {
    color: colors.green,
    fontWeight: "900",
  },
});