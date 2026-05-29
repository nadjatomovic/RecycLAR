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
    marginBottom: -8,
  },

  logoText: {
    width: isSmallPhone ? 185 : 215,
    height: isSmallPhone ? 52 : 60,
    marginTop: -8,
  },

  tagline: {
    marginTop: 2,
    fontSize: isSmallPhone ? 27 : 30,
    lineHeight: isSmallPhone ? 33 : 37,
    fontWeight: "900",
    color: COLORS.purple,
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
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  locationIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.purpleSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  locationIcon: {
    width: 30,
    height: 30,
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
    fontWeight: "900",
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

    shadowColor: COLORS.green,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },

  mainButtonIcon: {
    position: "absolute",
    left: 26,
    fontSize: 24,
  },

  mainButtonText: {
    color: COLORS.white,
    fontSize: FONT.button,
    fontWeight: "900",
    letterSpacing: 0.2,
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

  loginIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  loginButtonText: {
    color: COLORS.purple,
    fontSize: 20,
    fontWeight: "800",
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
    fontWeight: "900",
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    fontWeight: "900",
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
    borderRadius: 18,
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
    fontWeight: "900",
  },

  cityCheck: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "900",
  },
});