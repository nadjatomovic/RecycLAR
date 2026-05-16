import { StyleSheet } from "react-native";

const colors = {
  green: "#35A936",
  purple: "#6B35C9",
  text: "#252733",
  muted: "#7A7A86",
  border: "#ECECF2",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  allowedGreen: "#27AE60",
  allowedGreenDark: "#1E7E34",
  allowedGreenBg: "#F4FBF3",
  allowedGreenBorder: "#B6E8C2",
  notAllowedRed: "#E53935",
  notAllowedRedDark: "#C62828",
  notAllowedRedBg: "#FFF4F4",
  notAllowedRedBorder: "#F5BBBB",
  cardBg: "#F8F8FB",
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 110 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: colors.purple,
    marginTop: -3,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandIcon: { width: 36, height: 36, marginRight: 8 },
  brandText: { fontSize: 24, fontWeight: "900" },
  brandGreen: { color: colors.green },
  brandPurple: { color: colors.purple },

  // Bin title card
  binTitleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 18,
    gap: 16,
  },
  binTitleImg: { width: 64, height: 64 },
  binTitleText: { fontSize: 26, fontWeight: "900", marginBottom: 4 },
  binMunicipality: { fontSize: 14, color: colors.muted },
  binMunicipalityName: { color: colors.purple, fontWeight: "800" },

  // Rules row
  rulesRow: { flexDirection: "row", gap: 12, marginBottom: 18 },
  rulesCard: { flex: 1, borderRadius: 20, borderWidth: 1, padding: 14 },
  allowedCard: {
    backgroundColor: colors.allowedGreenBg,
    borderColor: colors.allowedGreenBorder,
  },
  notAllowedCard: {
    backgroundColor: colors.notAllowedRedBg,
    borderColor: colors.notAllowedRedBorder,
  },
  rulesCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  allowedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.allowedGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  notAllowedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.notAllowedRed,
  },
  allowedTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.allowedGreenDark,
  },
  notAllowedTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.notAllowedRedDark,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ruleEmoji: { fontSize: 18 },
  ruleLabel: { fontSize: 13, color: colors.text, fontWeight: "600", flex: 1 },

  // Quick examples
  examplesSection: { marginBottom: 18 },
  examplesSectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },
  examplesRow: { flexDirection: "row", gap: 10 },
  exampleCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: "center",
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  exampleBin: { fontSize: 13, fontWeight: "900", textAlign: "center" },

  // Lari tip
  lariRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
    gap: 12,
  },
  lariImg: { width: 80, height: 80 },
  lariBubble: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  lariTipText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontWeight: "600",
  },

  // Login hint
  loginHint: { alignItems: "center", paddingVertical: 8 },
  loginHintText: { fontSize: 14, color: colors.muted },
  loginHintLink: { color: colors.purple, fontWeight: "900" },

  // Bottom tab
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
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabIcon: { fontSize: 25, color: colors.purple, marginBottom: 2 },
  tabIconActive: { color: colors.green },
  tabLabel: { fontSize: 12, color: colors.muted },
  tabLabelActive: { color: colors.green, fontWeight: "900" },
});
