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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: 88,
  },

  lockedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  lockedIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 27,
    fontWeight: "700",
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
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 4,
    lineHeight: 20,
  },
  subtitleGreen: {
    color: COLORS.green,
    fontWeight: "700",
  },
  headerTrophy: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },

  filterRow: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  filterBtnActive: {
    backgroundColor: COLORS.purple,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#EEF0F4",
    borderRadius: RADIUS.pill,
    padding: 5,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: RADIUS.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.muted,
  },

  podiumWrapper: {
    backgroundColor: "transparent",
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 0,
    marginHorizontal: 0,
    marginBottom: 16,
  },

  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  podiumCenter: {
    flex: 1,
    alignItems: "center",
    zIndex: 3,
  },

  podiumSide: {
    flex: 1,
    alignItems: "center",
    zIndex: 2,
  },

  podiumCard: {
    alignSelf: "stretch",
  },

  podiumColumn: {
    width: "100%",
    alignItems: "center",
  },

  podiumInfo: {
    alignItems: "center",
    width: "100%",
  },

  podiumCard1: {
    height: 120,
    backgroundColor: "#22C55E",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  podiumCard2: {
    height: 90,
    backgroundColor: "#7C3AED",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  podiumCard3: {
    height: 70,
    backgroundColor: "#A78BFA",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  podiumCardMe: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },

  podiumPlaceholder: {
    flex: 1,
  },

  medalBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginBottom: 6,
  },

  medalText: {
    fontSize: 14,
    marginRight: 2,
  },

  medalRank: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  podiumAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },

  podiumAvatarWrap1: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  podiumName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 2,
  },

  podiumName1: {
    fontSize: 14,
  },

  podiumPts: {
    fontSize: 11,
    fontWeight: "600",
    color: "#22C55E",
    textAlign: "center",
    marginBottom: 8,
  },

  podiumPts1: {
    fontSize: 13,
  },

  listSection: {
    gap: 10,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    position: "relative",
  },
  rowCardMe: {
    backgroundColor: COLORS.greenSoft,
    borderColor: "#86EFAC",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
  },

  tiLabel: {
    position: "absolute",
    left: -1,
    top: -1,
    bottom: -1,
    width: 32,
    backgroundColor: COLORS.green,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tiText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
    transform: [{ rotate: "-90deg" }],
    letterSpacing: 0.5,
  },

  rowRank: {
    width: 26,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.muted,
    textAlign: "center",
    marginLeft: 4,
  },
  rowRankMe: {
    color: COLORS.green,
    marginLeft: 36,
  },
  rowAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  rowNameMe: {
    color: COLORS.greenDark,
  },
  rowSub: {
    fontSize: 11,
    color: COLORS.lightText,
    fontWeight: "600",
    marginTop: 2,
  },
  streakPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    marginRight: 8,
  },
  streakText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  rowPts: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.green,
    marginRight: 4,
  },
  rowPtsMe: {
    color: COLORS.greenDark,
  },
  rowChevron: {
    fontSize: 18,
    color: COLORS.muted,
    fontWeight: "700",
  },

  myPositionWrap: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  myPositionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  loadingBox: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "600",
  },

  updatedAt: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.lightText,
    fontWeight: "600",
    marginTop: 20,
  },
  locationPill: {
    backgroundColor: "#F3EEFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#E0D4F7",
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.purple,
  },

  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },

  filterIcon: {
    width: 34,
    height: 34,
    marginRight: 6,
  },

  filterIconActive: {
    opacity: 1,
  },

  tabIcon: {
    width: 34,
    height: 34,
    marginRight: 6,
  },

  tabTextActive: {
    color: COLORS.text,
  },

  lockedImage: {
    width: 74,
    height: 74,
    marginBottom: 12,
  },
});
