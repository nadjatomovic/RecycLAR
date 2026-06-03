import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");

const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 10,
    paddingBottom: 28,
    minHeight: height,
  },

  header: {
    alignItems: "center",
  },

  mainIcon: {
    width: isSmallPhone ? 104 : 122,
    height: isSmallPhone ? 104 : 122,
    marginBottom: -20,
},

logoText: {
    width: isSmallPhone ? 340 : 380,
    height: isSmallPhone ? 120 : 140,
    marginTop: -40,
},

  tagline: {
    marginTop: -34,
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    fontWeight: "700",
    color: "#7C3AED",
    textAlign: "center",
    letterSpacing: -0.4,
  },

  description: {
    marginTop: 8,
    maxWidth: 300,
    fontSize: FONT.body,
    lineHeight: 23,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "500",
  },

  heroCard: {
    marginTop: isSmallPhone ? 12 : 18,
    width: "100%",
    height: isSmallPhone ? width * 0.56 : width * 0.64,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#FBFCF7",
  },

  heroImage: {
    width: width * 0.96,
    height: isSmallPhone ? width * 0.58 : width * 0.68,
  },

  dropdownContainer: {
    marginTop: 16,
    minHeight: 72,
    borderRadius: RADIUS.pill,
    paddingLeft: 14,
    paddingRight: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  locationIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.purpleSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  locationIcon: {
    width: 60,
    height: 60,
  },

  loginIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },

  dropdownSmallLabel: {
    fontSize: 13,
    color: COLORS.lightText,
    fontWeight: "600",
    marginBottom: 1,
  },

  dropdownLabel: {
    fontSize: 21,
    color: COLORS.purple,
    fontWeight: "700",
  },

  chevron: {
    fontSize: 28,
    color: "#A8A8B2",
    marginBottom: 8,
    marginLeft: 8,
  },

  mainButton: {
    marginTop: 18,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  mainButtonIcon: {
    position: "absolute",
    left: 26,
    fontSize: 24,
  },

  mainButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
},

  arrowCircle: {
    position: "absolute",
    right: 10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    color: COLORS.green,
    fontSize: 38,
    lineHeight: 38,
    marginTop: -3,
    fontWeight: "700",
  },

  loginButton: {
    marginTop: 14,
    height: 60,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: "#DCCBF6",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loginButtonText: {
    color: COLORS.purple,
    fontSize: 20,
    fontWeight: "700",
  },

  bottomInfo: {
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  bottomInfoIcon: {
    color: COLORS.green,
    fontSize: 15,
    marginRight: 7,
    fontWeight: "700",
  },

  bottomInfoText: {
    fontSize: FONT.small,
    color: COLORS.muted,
    fontWeight: "500",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
  },

  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#DDDDE6",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  modalSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 18,
    lineHeight: 20,
  },

  cityOption: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 9,
    backgroundColor: "#F7F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cityOptionActive: {
    backgroundColor: COLORS.purpleSoft,
    borderWidth: 1,
    borderColor: "#D9C8FF",
  },

  cityText: {
    fontSize: 17,
    color: COLORS.text,
    fontWeight: "700",
  },

  cityTextActive: {
    color: COLORS.purple,
    fontWeight: "700",
  },

  cityCheck: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "700",
  },
});
