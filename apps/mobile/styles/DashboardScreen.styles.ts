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
    alignSelf: "flex-start",
    marginBottom: isSmallPhone ? 14 : 20,
  },

  topBrandIcon: {
    width: 48,
    height: 48,
    marginRight: 10,
  },

  topBrandLogo: {
    width: 145,
    height: 42,
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

  mascotArea: {
    height: isSmallPhone ? 142 : 168,
    marginBottom: 8,
    position: "relative",
  },

  speechBubble: {
    position: "absolute",
    left: 0,
    top: isSmallPhone ? 18 : 24,
    maxWidth: width * 0.54,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 22,
    zIndex: 2,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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

  mascotImage: {
    position: "absolute",
    right: -8,
    bottom: 0,
    width: isSmallPhone ? 140 : 170,
    height: isSmallPhone ? 140 : 170,
  },

  scanButton: {
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,

    shadowColor: COLORS.green,
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  scanCameraIcon: {
    position: "absolute",
    left: 22,
    width: 30,
    height: 30,
  },

  scanButtonText: {
    color: COLORS.white,
    fontSize: FONT.button,
    fontWeight: "900",
    letterSpacing: 0.1,
  },

  scanArrowCircle: {
    position: "absolute",
    right: 10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  scanArrow: {
    color: COLORS.green,
    fontSize: 38,
    lineHeight: 38,
    marginTop: -3,
    fontWeight: "800",
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
    minHeight: 94,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.shadow,
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
    color: COLORS.purple,
    fontWeight: "900",
    marginBottom: 5,
  },

  exampleName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "800",
  },

  exampleArrow: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "900",
    marginHorizontal: 4,
  },

  exampleBinImg: {
    width: 30,
    height: 36,
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