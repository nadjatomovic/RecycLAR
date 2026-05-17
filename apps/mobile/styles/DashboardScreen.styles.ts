import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const colors = {
  green: "#35A936",
  greenDark: "#238A2E",
  purple: "#6B35C9",
  purpleLight: "#EFE8FF",
  text: "#252733",
  muted: "#7A7A86",
  border: "#ECECF2",
  bg: "#F8FAF5",
  white: "#FFFFFF",
  red: "#D84343",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 106,
  },

  welcomeSection: {
    marginBottom: 22,
  },

  welcomeTitle: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  welcomeSub: {
    fontSize: 19,
    lineHeight: 27,
    color: colors.muted,
  },

  locationCard: {
    minHeight: 102,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    marginBottom: 14,
  },

  locationIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  locationIcon: {
    width: 36,
    height: 36,
  },

  locationTextWrap: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 2,
  },

  locationName: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.purple,
    marginBottom: 2,
  },

  changeLocation: {
    fontSize: 16,
    color: colors.purple,
    fontWeight: "700",
  },

  mascotArea: {
    height: 174,
    marginBottom: 6,
    position: "relative",
  },

  speechBubble: {
    position: "absolute",
    left: 0,
    top: 24,
    maxWidth: width * 0.52,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    zIndex: 2,
  },

  speechText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },

  speechStrong: {
    color: colors.purple,
    fontWeight: "900",
  },

  mascotImage: {
    position: "absolute",
    right: -8,
    bottom: 0,
    width: 172,
    height: 172,
  },

  scanButton: {
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: colors.green,
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    marginBottom: 18,
  },

  scanCameraIcon: {
    position: "absolute",
    left: 24,
    width: 31,
    height: 31,
  },

  scanButtonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },

  scanArrowCircle: {
    position: "absolute",
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  scanArrow: {
    color: colors.green,
    fontSize: 36,
    lineHeight: 36,
    marginTop: -2,
  },

  binsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  binCard: {
    width: (width - 60) / 5,
    minHeight: 84,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  binImg: {
    width: 42,
    height: 42,
    marginBottom: 6,
  },

  binLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "700",
    textAlign: "center",
  },

  rulesHint: {
    textAlign: "center",
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
  },

  allowedText: {
    color: colors.green,
    fontWeight: "800",
  },

  notAllowedText: {
    color: colors.purple,
    fontWeight: "800",
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
    minHeight: 92,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  exampleWasteImg: {
    width: 38,
    height: 44,
    marginRight: 9,
  },

  exampleMiddle: {
    flex: 1,
  },

  exampleTitle: {
    fontSize: 12,
    color: colors.purple,
    fontWeight: "900",
    marginBottom: 5,
  },

  exampleName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "800",
  },

  exampleArrow: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "900",
    marginHorizontal: 4,
  },

  exampleBinImg: {
    width: 28,
    height: 34,
  },

  loginHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  loginHintIcon: {
    fontSize: 16,
    color: colors.muted,
    marginRight: 8,
  },

  loginHintText: {
    fontSize: 14,
    color: colors.muted,
  },

  loginHintLink: {
    color: colors.purple,
    fontWeight: "900",
  },

  bottomTab: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
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
    elevation: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabIcon: {
    fontSize: 27,
    color: colors.purple,
    marginBottom: 2,
  },

  tabIconActive: {
    color: colors.green,
  },

  tabLabel: {
    fontSize: 13,
    color: colors.muted,
  },

  tabLabelActive: {
    color: colors.green,
    fontWeight: "900",
  },

  topBrandRow: {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
  marginTop: 6,
  marginBottom: 24,
  paddingHorizontal: 4,
},

topBrandIcon: {
  width: 46,
  height: 46,
  marginRight: 10,
},

topBrandText: {
  fontSize: 28,
  fontWeight: "900",
  letterSpacing: 0.3,
},

topBrandGreen: {
  color: "#34A936",
},

topBrandPurple: {
  color: "#6B35C9",
},
});