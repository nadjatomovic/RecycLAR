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
    paddingBottom: 110,
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
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  topBackText: {
    fontSize: 34,
    lineHeight: 34,
    color: COLORS.purple,
    fontWeight: "600",
    marginTop: -4,
  },

  brandLogoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  topBrandIcon: {
    width: 46,
    height: 46,
    marginRight: 8,
  },

  topBrandText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
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
    fontSize: isSmallPhone ? 34 : 38,
    lineHeight: isSmallPhone ? 39 : 44,
    fontWeight: "900",
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
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  locationIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  locationIcon: {
    width: 34,
    height: 34,
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
    fontWeight: "900",
    color: COLORS.purple,
  },

  changeLocation: {
    fontSize: 15,
    color: COLORS.purple,
    fontWeight: "800",
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
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
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
    backgroundColor: "#F0FDF4", 
  },

  dropdownItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  dropdownItemTextActive: {
    color: COLORS.green,
    fontWeight: "900",
  },

  dropdownCheckmark: {
    fontSize: 16,
    color: COLORS.green,
    fontWeight: "900",
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
  borderRadius: 24,
  zIndex: 2,

  shadowColor: "#000",
  shadowOpacity: 0.14,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
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
  shadowOpacity: 0.10,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 6,
},

  speechText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    fontWeight: "600",
  },

  speechStrong: {
    color: COLORS.purple,
    fontWeight: "900",
  },
  
scanButton: {
  minHeight: 96,
  borderRadius: 32,
  backgroundColor: COLORS.green,
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: 15,
  paddingRight: 12,
  paddingVertical: 14,
  marginBottom: 22,
  position: "relative",
  overflow: "hidden",

  shadowColor: COLORS.green,
  shadowOpacity: 0.35,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 12 },
  elevation: 9,
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
  width: 34,
  height: 34,
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
  fontWeight: "900",
  letterSpacing: 0.9,
},

scanButtonText: {
  color: COLORS.white,
  fontSize: isSmallPhone ? 21 : 23,
  lineHeight: isSmallPhone ? 25 : 28,
  fontWeight: "900",
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
  shadowOpacity: 0.10,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
},

scanArrow: {
  color: COLORS.green,
  fontSize: 40,
  lineHeight: 40,
  marginTop: -3,
  fontWeight: "900",
},


  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
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
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  binImg: {
    width: 47,
    height: 47,
    marginBottom: 5,
  },

  binLabel: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: "800",
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
    fontWeight: "900",
  },

  notAllowedText: {
    color: COLORS.purple,
    fontWeight: "900",
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
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
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
    fontWeight: "900",
  },

  exampleBinImg: {
    width: 34,
    height: 38,
  },

  exampleTitle: {
    fontSize: 12,
    color: COLORS.purple,
    fontWeight: "900",
    marginBottom: 3,
    textAlign: "center",
  },

  exampleName: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: "900",
    textAlign: "center",
    maxWidth: "100%",
  },

  exampleBinName: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "800",
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
    fontWeight: "900",
  },
});
