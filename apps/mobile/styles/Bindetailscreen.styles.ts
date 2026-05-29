import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, RADIUS, SPACING } from "../utils/theme";

const { height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 10,
    paddingBottom: 112,
  },

  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
    width: 38,
    height: 38,
    marginRight: 8,
  },

  brandLogo: {
    width: 128,
    height: 38,
  },

  headerSpacer: {
    width: 44,
  },

  binHeroCard: {
    minHeight: 138,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  binHeroText: {
    flex: 1,
    paddingRight: 8,
  },

  overline: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  binTitleImg: {
    width: isSmallPhone ? 88 : 108,
    height: isSmallPhone ? 88 : 108,
  },

  binTitleText: {
    fontSize: isSmallPhone ? 25 : 29,
    lineHeight: isSmallPhone ? 31 : 35,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: -0.4,
  },

  binMunicipality: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "600",
  },

  binMunicipalityName: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  rulesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  rulesCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 14,
    minHeight: 230,
  },

  allowedCard: {
    backgroundColor: "#F4FBF3",
    borderColor: "#B6E8C2",
  },

  notAllowedCard: {
    backgroundColor: "#FFF4F4",
    borderColor: "#F5BBBB",
  },

  rulesCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  allowedIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#27AE60",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },

  notAllowedIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },

  allowedIcon: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 14,
  },

  notAllowedIcon: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 16,
    marginTop: -1,
  },

  allowedTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1E7E34",
  },

  notAllowedTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#C62828",
  },

  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  ruleBullet: {
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.muted,
    marginRight: 7,
  },

  ruleLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
    fontWeight: "600",
  },

  examplesSection: {
    marginBottom: 18,
  },

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  examplesRow: {
    flexDirection: "row",
    gap: 10,
  },

  exampleCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    justifyContent: "space-between",
  },

  exampleLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  exampleBin: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  lariRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },

  lariImg: {
    width: 84,
    height: 84,
    marginRight: 12,
  },

  lariBubble: {
    flex: 1,
    backgroundColor: "#F8F8FB",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },

  lariLabel: {
    fontSize: 12,
    color: COLORS.purple,
    fontWeight: "900",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  lariTipText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    fontWeight: "600",
  },

  loginHint: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  loginHintText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
    textAlign: "center",
  },

  loginHintLink: {
    color: COLORS.purple,
    fontWeight: "900",
  },
});