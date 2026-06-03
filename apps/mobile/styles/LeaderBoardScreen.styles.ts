import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

export const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────────────────────────
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

  // ── Locked state ────────────────────────────────────────────────────────────
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

  // ── Header ──────────────────────────────────────────────────────────────────
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

  // ── Filter row (Tedensko / Mesečno / Vsi časi) ──────────────────────────────
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

  // ── Tab row (Posamezniki / Razredi) ─────────────────────────────────────────
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
    alignItems: "center",
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
  tabTextActive: {
    color: COLORS.text,
    fontWeight: "700",
  },

  // ── Podium ──────────────────────────────────────────────────────────────────
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 20,
    minHeight: 240,
  },
  podiumCenter: {
    flex: 1,
    alignItems: "center",
    zIndex: 2,
  },
  podiumSide: {
    flex: 0.85,
    alignItems: "center",
    marginTop: 30,
  },
  podiumCard: {
    width: "100%",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    position: "relative",
  },
  podiumCard1: {
    borderColor: "#FDE68A",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
  },
  podiumCard2: {
    borderColor: "#D1D5DB",
  },
  podiumCard3: {
    borderColor: "#FDDBB4",
  },
  podiumCardMe: {
    borderColor: COLORS.green,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
  },
  podiumPlaceholder: {
    flex: 0.85,
  },

  // Medal badge
  medalBadge: {
    position: "absolute",
    top: -14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  medalText: {
    fontSize: 14,
    marginRight: 2,
  },
  medalRank: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },

  // Avatar
  podiumAvatarWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 2.5,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  podiumAvatarWrap1: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },

  // Name & points
  podiumName: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 4,
  },
  podiumName1: {
    fontSize: 14,
  },
  podiumPts: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.green,
  },
  podiumPts1: {
    fontSize: 13,
  },

  // ── Row list ─────────────────────────────────────────────────────────────────
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

  // "Ti" green badge
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

  // ── My position pinned ───────────────────────────────────────────────────────
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

  // ── Loading / empty ──────────────────────────────────────────────────────────
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

  // ── Footer ───────────────────────────────────────────────────────────────────
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
  },
  locationText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.purple,
  },
});
