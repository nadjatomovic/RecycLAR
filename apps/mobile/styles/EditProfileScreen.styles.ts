import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 8 : 14,
    paddingBottom: 38,
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 13,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  backText: {
    fontSize: 38,
    lineHeight: 38,
    color: COLORS.purple,
    fontWeight: "700",
    marginTop: -4,
  },

  headerTextWrap: {
    flex: 1,
  },

  screenTitle: {
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    color: COLORS.text,
    fontWeight: "700",
    letterSpacing: -0.8,
  },

  screenSubtitle: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
    fontWeight: "600",
  },

  avatarPreviewCard: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  avatarPreviewCircle: {
    width: isSmallPhone ? 112 : 126,
    height: isSmallPhone ? 112 : 126,
    borderRadius: isSmallPhone ? 56 : 63,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#D8C8F8",
    marginBottom: 14,
  },

  avatarPreviewImage: {
    width: "100%",
    height: "100%",
  },

  avatarPreviewTitle: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "700",
    textAlign: "center",
  },

  avatarPreviewSub: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "700",
    textAlign: "center",
  },

  sectionCard: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 16,
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  avatarOption: {
    width: "48%",
    borderRadius: 16,
    backgroundColor: "#F8F8FB",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
  },

  avatarOptionActive: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: COLORS.purple,
  },

  avatarOptionImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 8,
  },

  avatarOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "700",
  },

  avatarOptionTextActive: {
    color: COLORS.purple,
    fontWeight: "700",
  },

  selectedCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedCheckText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  inputLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 8,
  },

  textInput: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: "#F8F8FB",
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 18,
  },

  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  cityOption: {
    width: "48%",
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: "#F8F8FB",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  cityOptionActive: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenSoft,
  },

  cityOptionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "700",
  },

  cityOptionTextActive: {
    color: COLORS.green,
    fontWeight: "700",
  },

  cityCheck: {
    fontSize: 16,
    color: COLORS.green,
    fontWeight: "700",
  },

  saveButton: {
    minHeight: 58,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },

  cancelButton: {
    minHeight: 54,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "700",
  },
});
