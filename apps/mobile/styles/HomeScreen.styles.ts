import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const GREEN = "#2EAA4A";
export const PURPLE = "#7C3AED";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 36,
    alignItems: "center",
  },

  // ── Header ──
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
  mainIcon: {
    width: 140,
    height: 140,
  },
  logoText: {
    width: width * 0.82,
    height: 80,
    marginTop: -8,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "800",
    color: PURPLE,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },

  // ── Hero ──
  heroSection: {
    marginVertical: 8,
    alignItems: "center",
  },
  heroImage: {
    width: width * 0.95,
    height: 300,
  },

  // ── Dropdown ──
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    width: width * 0.88,
    padding: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PURPLE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dropdownLabel: {
    fontSize: 16,
    color: "#444",
  },
  selectedCityText: {
    fontWeight: "800",
    color: PURPLE,
  },
  chevron: {
    fontSize: 22,
    color: "#CCC",
  },

  // ── Main Button ──
  mainButton: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.88,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 35,
    marginBottom: 12,
    shadowColor: GREEN,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  leafIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  mainButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
  },
  whiteArrowCircle: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  greenArrow: {
    color: GREEN,
    fontSize: 20,
    fontWeight: "bold",
  },

  // ── Login Button ──
  loginButton: {
    width: width * 0.88,
    paddingVertical: 14,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#DDD0F5",
    alignItems: "center",
    backgroundColor: "#FDFAFF",
  },
  userIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  loginButtonText: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: "700",
  },

  // ── Footer ──
  footer: {
    marginTop: 22,
  },
  footerText: {
    fontSize: 13,
    color: "#BBB",
    textAlign: "center",
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: PURPLE,
    textAlign: "center",
    marginBottom: 14,
  },
  cityOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    alignItems: "center",
  },
  cityOptionSelected: {
    backgroundColor: "#F5F0FF",
    borderRadius: 12,
  },
  cityText: {
    fontSize: 17,
    color: "#333",
  },
  cityTextSelected: {
    fontWeight: "800",
    color: PURPLE,
  },
});
