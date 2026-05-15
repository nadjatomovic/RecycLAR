import { StyleSheet } from "react-native";

const colors = {
  green: "#35A936",
  purple: "#6B35C9",
  purpleLight: "#EFE8FF",
  text: "#252733",
  muted: "#7A7A86",
  border: "#ECECF2",
  white: "#FFFFFF",
  bg: "#FFFFFF",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 34,
  },

  backButton: {
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
    marginBottom: 8,
  },

  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: colors.purple,
    marginTop: -3,
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  logoIcon: {
    width: 96,
    height: 96,
    marginBottom: -6,
  },

  brandText: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  brandGreen: {
    color: colors.green,
  },

  brandPurple: {
    color: colors.purple,
  },

  headerSection: {
    marginBottom: 18,
  },

  title: {
    fontSize: 39,
    lineHeight: 45,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.muted,
  },

  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  roleCard: {
    flex: 1,
    height: 54,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  roleCardActive: {
    backgroundColor: colors.purpleLight,
    borderColor: "#D8C8F8",
  },

  roleText: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: "800",
  },

  roleTextActive: {
    color: colors.purple,
    fontWeight: "900",
  },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  inputGroup: {
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    height: 56,
    borderRadius: 20,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },

  helperText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },

  primaryButton: {
    marginTop: 6,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.green,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "900",
  },

  arrowCircle: {
    position: "absolute",
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: {
    color: colors.green,
    fontSize: 34,
    lineHeight: 34,
    marginTop: -2,
  },

  switchAuth: {
    marginTop: 22,
    alignItems: "center",
  },

  switchText: {
    fontSize: 15,
    color: colors.muted,
  },

  switchLink: {
    color: colors.purple,
    fontWeight: "900",
  },
    schoolToggle: {
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8F8FB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  schoolToggleActive: {
    backgroundColor: colors.purpleLight,
    borderColor: "#D8C8F8",
  },

  schoolToggleTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 3,
  },

  schoolToggleTitleActive: {
    color: colors.purple,
  },

  schoolToggleSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    maxWidth: 230,
  },

  schoolToggleIcon: {
    fontSize: 26,
    color: colors.purple,
    fontWeight: "900",
  },

  schoolToggleIconActive: {
    color: colors.green,
  },

  schoolBox: {
    borderRadius: 24,
    backgroundColor: "#FBFAFF",
    borderWidth: 1,
    borderColor: "#E7DCF9",
    padding: 14,
    marginBottom: 16,
  },

  schoolBoxTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },
});