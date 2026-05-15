import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const colors = {
  green: "#34A936",
  greenDark: "#238A2E",
  purple: "#6B35C9",
  purpleLight: "#EFE8FF",
  text: "#242631",
  muted: "#777782",
  border: "#EDEDF3",
  white: "#FFFFFF",
  bg: "#FFFFFF",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 4,
    paddingBottom: 28,
    minHeight: height,
  },

  header: {
    alignItems: "center",
    marginTop: 0,
  },

  mainIcon: {
    width: 136,
    height: 136,
    marginBottom: -4,
  },

  logoText: {
    width: 250,
    height: 74,
    marginTop: -14,
  },

  tagline: {
    marginTop: 0,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "900",
    color: colors.purple,
    textAlign: "center",
  },

  description: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 24,
    color: colors.muted,
    textAlign: "center",
  },

  heroSection: {
    marginTop: 18,
    width: "100%",
    height: width * 0.68,
    alignItems: "center",
    justifyContent: "center",
  },

  heroImage: {
    width: width * 0.98,
    height: width * 0.72,
  },

  dropdownContainer: {
    marginTop: 10,
    height: 74,
    borderRadius: 37,
    paddingLeft: 16,
    paddingRight: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purpleLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  locationIcon: {
    width: 30,
    height: 30,
  },

  dropdownLabel: {
    fontSize: 20,
    color: colors.text,
    fontWeight: "500",
  },

  selectedCityText: {
    color: colors.purple,
    fontWeight: "900",
  },

  chevron: {
    fontSize: 27,
    color: "#A8A8B2",
    marginBottom: 8,
  },

  mainButton: {
    marginTop: 18,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.green,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },

  mainButtonLeftIcon: {
    position: "absolute",
    left: 25,
    width: 28,
    height: 28,
    tintColor: colors.white,
  },

  mainButtonLeaf: {
    position: "absolute",
    left: 28,
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },

  mainButtonText: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
  },

  arrowCircle: {
    position: "absolute",
    right: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    color: colors.green,
    fontSize: 38,
    lineHeight: 38,
    marginTop: -3,
  },

  loginButton: {
    marginTop: 16,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#DCCBF6",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loginIcon: {
    color: colors.purple,
    fontSize: 25,
    marginRight: 12,
  },

  loginButtonText: {
    color: colors.purple,
    fontSize: 22,
    fontWeight: "800",
  },

  bottomInfo: {
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  bottomInfoIcon: {
    color: colors.green,
    fontSize: 17,
    marginRight: 7,
  },

  bottomInfoText: {
    fontSize: 13,
    color: colors.muted,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 16,
  },

  cityOption: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 8,
    backgroundColor: "#F7F7FA",
  },

  cityOptionActive: {
    backgroundColor: colors.purpleLight,
  },

  cityText: {
    fontSize: 18,
    color: colors.text,
  },

  cityTextActive: {
    color: colors.purple,
    fontWeight: "900",
  },
});