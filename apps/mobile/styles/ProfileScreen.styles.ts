import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 6 : 10,
    paddingBottom: 112,
  },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "700",
  },

  emptyText: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "600",
  },

  loginBtn: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },

  loginBtnText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 15,
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
    width: 46,
    height: 46,
    marginRight: 10,
  },

  brandLogo: {
    width: 150,
    height: 44,
  },

  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  notificationText: {
    fontSize: 21,
  },

  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.purple,
  },

  screenTitle: {
    fontSize: isSmallPhone ? 36 : 40,
    lineHeight: isSmallPhone ? 42 : 46,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 18,
    letterSpacing: -0.9,
  },

  profileCard: {
    borderRadius: 30,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  avatarWrap: {
    width: isSmallPhone ? 96 : 108,
    height: isSmallPhone ? 96 : 108,
    borderRadius: isSmallPhone ? 48 : 54,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },

  avatar: {
    width: isSmallPhone ? 86 : 96,
    height: isSmallPhone ? 86 : 96,
  },

  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },

  cameraBadgeText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
  },

  profileInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  name: {
    flex: 1,
    fontSize: isSmallPhone ? 26 : 30,
    fontWeight: "900",
    color: COLORS.text,
    marginRight: 8,
    letterSpacing: -0.5,
  },

  editIcon: {
    fontSize: 24,
    color: COLORS.purple,
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

  metaEmoji: {
    fontSize: 18,
    marginRight: 6,
  },

  metaLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 2,
    fontWeight: "600",
  },

  metaValue: {
    fontSize: 15,
    color: COLORS.purple,
    fontWeight: "900",
  },

  metaDivider: {
    width: 1,
    height: 42,
    backgroundColor: COLORS.border,
    marginHorizontal: 9,
  },

  teacherMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  teacherMetaEmoji: {
    fontSize: 15,
    marginRight: 7,
  },

  teacherMetaText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    fontWeight: "600",
  },

  teacherMetaHighlight: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    width: (width - 62) / 4,
    minHeight: isSmallPhone ? 112 : 122,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  statIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F1FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  statIcon: {
    fontSize: 22,
  },

  statLabel: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "700",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  sectionCard: {
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 18,

    shadowColor: COLORS.shadow,
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
    color: COLORS.text,
  },

  viewAll: {
    fontSize: 14,
    color: COLORS.purple,
    fontWeight: "900",
  },

  achievementsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  achievementItem: {
    width: "31%",
    alignItems: "center",
  },

  lockedAchievement: {
    opacity: 0.55,
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

  lockedImage: {
    opacity: 0.4,
  },

  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  lockIcon: {
    fontSize: 20,
  },

  teacherAchievementEmoji: {
    fontSize: 36,
  },

  ribbon: {
    position: "absolute",
    bottom: -18,
    backgroundColor: COLORS.purple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 82,
    alignItems: "center",
  },

  ribbonText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "900",
  },

  achievementTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },

  achievementDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.muted,
    textAlign: "center",
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },

  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  activityIconEmoji: {
    fontSize: 20,
  },

  activityTextWrap: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 3,
  },

  activityDescription: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  activityRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  activityPoints: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  activityTime: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 61,
  },

  classRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  classCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  classCircleText: {
    fontSize: 14,
    fontWeight: "900",
  },

  classInfo: {
    flex: 1,
  },

  className: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },

  classPoints: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    fontWeight: "600",
  },

  classMedal: {
    fontSize: 20,
    marginRight: 8,
  },

  classArrow: {
    fontSize: 22,
    color: COLORS.lightText,
    fontWeight: "900",
  },

  signOutBtn: {
    marginTop: 2,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  signOutText: {
    color: "#EF4444",
    fontWeight: "900",
    fontSize: 15,
  },
});