import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
  },

  lockedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  lockedIcon: {
    fontSize: 62,
    marginBottom: 16,
  },

  lockedTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },

  lockedText: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 26,
    fontWeight: "600",
  },

  loginButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: RADIUS.pill,
    width: "100%",
    alignItems: "center",

    shadowColor: COLORS.green,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  loginButtonText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 16,
  },

  header: {
    marginBottom: 16,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
  },

  trophyCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },

  trophyText: {
    fontSize: 28,
  },

  subtitle: {
    maxWidth: 330,
    fontSize: 16,
    color: COLORS.muted,
    lineHeight: 23,
    marginTop: 6,
    fontWeight: "500",
  },

  switchWrap: {
    flexDirection: "row",
    backgroundColor: "#E9ECEF",
    borderRadius: RADIUS.pill,
    padding: 5,
    marginBottom: 18,
  },

  switchButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
  },

  switchButtonActive: {
    backgroundColor: COLORS.white,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  switchText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.muted,
  },

  switchTextActive: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  topCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  topCardLabel: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  topCardName: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },

  topCardPoints: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.green,
  },

  listContent: {
    paddingBottom: 110,
  },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
  },

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 22,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  rankBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7F7FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rankBoxTop1: {
    backgroundColor: "#FEF3C7",
  },

  rankBoxTop2: {
    backgroundColor: "#F3F4F6",
  },

  rankBoxTop3: {
    backgroundColor: "#FDEBD3",
  },

  rankMedal: {
    fontSize: 22,
  },

  rankNumber: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.muted,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },

  itemClass: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 3,
    fontWeight: "600",
  },

  pointsPill: {
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },

  pointsText: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.green,
  },

  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "600",
  },
});