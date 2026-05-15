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
    marginBottom: 12,
  },

  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: colors.purple,
    marginTop: -3,
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoIcon: {
    width: 116,
    height: 116,
    marginBottom: -6,
  },

  brandText: {
    fontSize: 34,
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
    marginBottom: 22,
  },

  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: colors.muted,
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
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    height: 58,
    borderRadius: 20,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },

  forgotText: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: "800",
  },

  primaryButton: {
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

  infoBox: {
    marginTop: 18,
    backgroundColor: "#F4FBF3",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#DFF2DC",
  },

  infoIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
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
});