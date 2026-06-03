import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 10,
    paddingBottom: 88,
  },

  topBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 4,
  },

  topBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  topBackText: {
    fontSize: 34,
    lineHeight: 34,
    color: COLORS.purple,
    fontWeight: "600",
    marginTop: -4,
  },


  topBrandIcon: {
    width: 42,
    height: 42,
    marginRight: 8,
},

logoText: {
    width: 2000,
    height: 90,
    marginTop: -8,
},

locationIcon: {
    width: 60,
    height: 60,
  },

brandLogoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
},
  topBrandText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  topBrandGreen: {
    color: COLORS.green,
  },

  topBrandPurple: {
    color: COLORS.purple,
  },

  placeholderSpacer: {
    width: 44,
  },

  welcomeSection: {
    marginBottom: 18,
  },

  welcomeTitle: {
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },

  welcomeSub: {
    maxWidth: 330,
    fontSize: 17,
    lineHeight: 25,
    color: COLORS.muted,
    fontWeight: "500",
  },

  locationCard: {
    minHeight: 96,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  locationIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  locationTextWrap: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
    marginBottom: 2,
  },

  locationName: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "700",
    color: COLORS.purple,
  },

  changeLocation: {
    fontSize: 15,
    color: COLORS.purple,
    fontWeight: "700",
    marginTop: 2,
  },

  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginTop: -6,
    marginBottom: 18,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },

  dropdownItemActive: {
    backgroundColor: COLORS.greenSoft,
  },

  dropdownItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  dropdownItemTextActive: {
    color: COLORS.green,
    fontWeight: "700",
  },

  dropdownCheckmark: {
    fontSize: 16,
    color: COLORS.green,
    fontWeight: "700",
  },

  mascotArea: {
    height: isSmallPhone ? 170 : 205,
    marginBottom: 4,
    position: "relative",
  },

  mascotImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },

  speechBubble: {
    position: "absolute",
    left: 0,
    top: isSmallPhone ? 56 : 68,
    width: width * 0.46,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 16,
    zIndex: 2,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  speechBubbleTail: {
    position: "absolute",
    right: -10,
    top: 34,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: COLORS.white,
  },

  speechBubbleTailShadow: {
    position: "absolute",
    right: -12,
    top: 36,
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 15,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "rgba(0,0,0,0.08)",
  },

  mascotShadowWrap: {
    position: "absolute",
    right: -18,
    top: isSmallPhone ? -4 : -8,
    width: isSmallPhone ? 185 : 225,
    height: isSmallPhone ? 185 : 225,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  speechText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    fontWeight: "600",
  },

  speechStrong: {
    color: COLORS.purple,
    fontWeight: "700",
  },

  scanButton: {
    minHeight: 96,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 12,
    paddingVertical: 14,
    marginBottom: 22,
    position: "relative",
    overflow: "hidden",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  scanGlowCircle: {
    position: "absolute",
    right: -38,
    top: -42,
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  scanIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.45)",
  },

  scanCameraIcon: {
    width: 60,
    height: 60,
  },

  logoHat: {
    width: 50,
    height: 50,
  },

  scanTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  scanBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
    marginBottom: 6,
  },

  scanBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
  },

  scanButtonText: {
    color: COLORS.white,
    fontSize: isSmallPhone ? 21 : 23,
    lineHeight: isSmallPhone ? 25 : 28,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  scanButtonSubtext: {
    marginTop: 3,
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  scanArrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  scanArrow: {
    color: COLORS.green,
    fontSize: 40,
    lineHeight: 40,
    marginTop: -3,
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  binsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  binCard: {
    width: (width - 62) / 5,
    minHeight: 88,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  binImg: {
    width: 47,
    height: 47,
    marginBottom: 5,
  },

  binLabel: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: "700",
    textAlign: "center",
  },

  rulesHint: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 18,
    fontWeight: "600",
  },

  allowedText: {
    color: COLORS.green,
    fontWeight: "700",
  },

  notAllowedText: {
    color: COLORS.purple,
    fontWeight: "700",
  },

  examplesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 18,
  },

  exampleCard: {
    width: "48%",
    minHeight: 132,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  exampleVisualRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  exampleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F8F8FB",
    alignItems: "center",
    justifyContent: "center",
  },

  exampleWasteImg: {
    width: 34,
    height: 38,
  },

  exampleArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  exampleArrow: {
    fontSize: 18,
    lineHeight: 20,
    color: COLORS.purple,
    fontWeight: "700",
  },

  exampleBinImg: {
    width: 34,
    height: 38,
  },

  exampleTitle: {
    fontSize: 12,
    color: COLORS.purple,
    fontWeight: "700",
    marginBottom: 3,
    textAlign: "center",
  },

  exampleName: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: "700",
    textAlign: "center",
    maxWidth: "100%",
  },

  exampleBinName: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
    textAlign: "center",
  },

  loginHint: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  loginHintIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  loginHintText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },

  loginHintLink: {
    color: COLORS.purple,
    fontWeight: "700",
  },
});
