import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

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
    paddingBottom: 34,
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
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.9,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.muted,
    fontWeight: "600",
  },

  activityCard: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  activityIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  activityIconEmoji: {
    fontSize: 22,
  },

  activityTextWrap: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },

  activityDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.muted,
    fontWeight: "600",
  },

  activityRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  activityPoints: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },

  activityTime: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 65,
  },
});
