import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SPACING } from "../utils/theme";

const { height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 6 : 10,
    paddingBottom: 96,
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "700",
  },

  header: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: COLORS.purple,
    marginTop: -4,
    fontWeight: "700",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 42,
    height: 42,
    marginRight: 8,
  },

  brandText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  brandGreen: {
    color: COLORS.green,
  },

  brandPurple: {
    color: COLORS.purple,
  },

  headerSpacer: {
    width: 44,
  },

  screenTitle: {
    fontSize: isSmallPhone ? 30 : 34,
    lineHeight: isSmallPhone ? 36 : 40,
    color: COLORS.text,
    fontWeight: "700",
    letterSpacing: -0.8,
  },

  screenSubtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },

  classCard: {
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  classIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  classIconText: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: "700",
  },

  classInfo: {
    flex: 1,
    minWidth: 0,
  },

  className: {
    fontSize: 17,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 2,
  },

  classSchool: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginBottom: 7,
  },

  classStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  classStat: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
  },

  pointsBox: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  pointsValue: {
    fontSize: 18,
    color: COLORS.green,
    fontWeight: "700",
  },

  pointsLabel: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
  },

  arrow: {
    fontSize: 24,
    color: COLORS.purple,
    fontWeight: "700",
    marginLeft: 8,
  },

  emptyCard: {
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    paddingVertical: 34,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 74,
    height: 74,
    marginBottom: 10,
    opacity: 0.8,
  },

  emptyTitle: {
    fontSize: 19,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    fontWeight: "600",
    textAlign: "center",
  },

  classInviteCode: {
  fontSize: 12,
  color: COLORS.purple,
  fontWeight: "700",
  marginBottom: 7,
},
});