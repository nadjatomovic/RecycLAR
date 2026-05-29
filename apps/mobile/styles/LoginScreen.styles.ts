import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, RADIUS, SPACING } from "../utils/theme";

const { height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 10,
    paddingBottom: 34,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: isSmallPhone ? 8 : 14,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: COLORS.purple,
    marginTop: -4,
    fontWeight: "700",
  },

  logoSection: {
    alignItems: "center",
    marginBottom: isSmallPhone ? 18 : 26,
  },

  logoIcon: {
    width: isSmallPhone ? 92 : 108,
    height: isSmallPhone ? 92 : 108,
    marginBottom: -8,
  },

  logoText: {
    width: isSmallPhone ? 170 : 200,
    height: isSmallPhone ? 48 : 56,
  },

  headerSection: {
    marginBottom: 20,
  },

  title: {
    fontSize: isSmallPhone ? 36 : 42,
    lineHeight: isSmallPhone ? 42 : 48,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },

  subtitle: {
    maxWidth: 340,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.muted,
    fontWeight: "500",
  },

  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
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
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#FFF4F4",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F5BBBB",
    marginBottom: 14,
  },

  errorText: {
    color: "#C62828",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },

  forgotButton: {
    alignSelf: "flex-end",
    minHeight: 34,
    justifyContent: "center",
    marginBottom: 12,
  },

  forgotText: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "900",
  },

  primaryButton: {
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    shadowColor: COLORS.green,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT.button,
    fontWeight: "900",
  },

  arrowCircle: {
    position: "absolute",
    right: 10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: {
    color: COLORS.green,
    fontSize: 38,
    lineHeight: 38,
    marginTop: -3,
    fontWeight: "800",
  },

  infoBox: {
    marginTop: 18,
    backgroundColor: COLORS.greenSoft,
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
    lineHeight: 21,
    color: COLORS.muted,
    fontWeight: "600",
  },

  switchAuth: {
    minHeight: 48,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  switchText: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "600",
  },

  switchLink: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  /* ================= НОВИ СТИЛОВИ ЗА МОДАЛОТ ================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: COLORS.white,
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E4E4E7",
    borderRadius: 3,
    marginBottom: 16,
  },

  modalLogo: {
    width: 50,
    height: 50,
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  modalInputWrapper: {
    width: "100%",
    marginBottom: 16,
  },

  modalInput: {
    backgroundColor: "#F4F4F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  modalErrorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 12,
    fontWeight: "500",
    textAlign: "center",
  },

  modalSubmitButton: {
    backgroundColor: COLORS.green,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  modalSubmitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  modalCancelButton: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
  },

  modalCancelButtonText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "500",
  },
});
