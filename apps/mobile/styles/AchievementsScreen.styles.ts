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
    marginBottom: 16,
    letterSpacing: -0.9,
  },

  summaryCard: {
    minHeight: 104,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  summaryLabel: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 26,
    color: COLORS.purple,
    fontWeight: "700",
  },

  summaryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryIcon: {
    fontSize: 30,
  },

  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  badgeCard: {
    width: (width - SPACING.lg * 2 - 14) / 2,
    minHeight: 252,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  badgeCardLocked: {
    backgroundColor: "#FBFBFC",
  },

  badgeImageWrap: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: COLORS.purpleSoft,
    borderWidth: 2,
    borderColor: "#D8C8F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },

  badgeImage: {
    width: 96,
    height: 96,
  },

  badgeImageLocked: {
    opacity: 0.28,
  },

  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  lockText: {
    fontSize: 24,
  },

  badgeName: {
    fontSize: 15,
    lineHeight: 19,
    color: COLORS.text,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    minHeight: 38,
  },

  badgeDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 48,
  },

  progressTrack: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 6,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  progressText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
  },
});
