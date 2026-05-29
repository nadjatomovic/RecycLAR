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
    marginBottom: isSmallPhone ? 8 : 12,

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
    marginBottom: isSmallPhone ? 14 : 20,
  },

  logoIcon: {
    width: isSmallPhone ? 82 : 96,
    height: isSmallPhone ? 82 : 96,
    marginBottom: -8,
  },

  logoText: {
    width: isSmallPhone ? 160 : 185,
    height: isSmallPhone ? 44 : 52,
  },

  headerSection: {
    marginBottom: 18,
  },

  title: {
    fontSize: isSmallPhone ? 34 : 39,
    lineHeight: isSmallPhone ? 40 : 45,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },

  subtitle: {
    maxWidth: 340,
    fontSize: 16,
    lineHeight: 23,
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

  inputGroupLast: {
    marginBottom: 0,
  },

  label: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    minHeight: 56,
    borderRadius: 20,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },

  municipalityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  municipalityChip: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  municipalityChipActive: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: "#D8C8F8",
  },

  municipalityChipText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "800",
  },

  municipalityChipTextActive: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  helperText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
    fontWeight: "600",
  },

  schoolToggle: {
    marginTop: 2,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F8F8FB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  schoolToggleActive: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: "#D8C8F8",
  },

  schoolToggleTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  schoolToggleTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 3,
  },

  schoolToggleTitleActive: {
    color: COLORS.purple,
  },

  schoolToggleSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
    fontWeight: "600",
  },

  schoolToggleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 34,
    backgroundColor: COLORS.white,
    color: COLORS.purple,
    fontSize: 22,
    fontWeight: "900",
  },

  schoolToggleIconActive: {
    color: COLORS.green,
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
    color: COLORS.text,
    marginBottom: 12,
  },

  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  roleCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  roleCardActive: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: "#D8C8F8",
  },

  roleIcon: {
    fontSize: 22,
    marginBottom: 4,
  },

  roleText: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "800",
  },

  roleTextActive: {
    color: COLORS.purple,
    fontWeight: "900",
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

  primaryButton: {
    marginTop: 4,
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
});