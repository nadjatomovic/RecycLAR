import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  header: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 8,
    paddingBottom: 8,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: COLORS.purple,
    marginTop: -4,
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  headerGreen: {
    color: COLORS.green,
  },

  headerPurple: {
    color: COLORS.purple,
  },

  titleRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 2,
    paddingBottom: 12,
  },

  title: {
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.7,
  },

  subtitle: {
    maxWidth: 330,
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.muted,
    fontWeight: "500",
  },

  statusRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  statusDot: {
    fontSize: 12,
    marginRight: 6,
  },

  statusText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "700",
  },

  cameraBox: {
    height: isSmallPhone ? 280 : 320,
    marginHorizontal: SPACING.lg,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  camera: {
    flex: 1,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  cornerTL: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 34,
    height: 34,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.green,
    borderTopLeftRadius: 8,
  },

  cornerTR: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 34,
    height: 34,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.green,
    borderTopRightRadius: 8,
  },

  cornerBL: {
    position: "absolute",
    bottom: 18,
    left: 18,
    width: 34,
    height: 34,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.green,
    borderBottomLeftRadius: 8,
  },

  cornerBR: {
    position: "absolute",
    bottom: 18,
    right: 18,
    width: 34,
    height: 34,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.green,
    borderBottomRightRadius: 8,
  },

  goodLight: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    backgroundColor: "rgba(34, 197, 94, 0.95)",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  goodLightText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.58)",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: COLORS.white,
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
  },

  centerLoader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },

  loadingBinsText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
  },

  resultsScroll: {
    flex: 1,
  },

  resultsContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 16,
    paddingBottom: 8,
  },

  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  resultLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 4,
    marginTop: 4,
    fontWeight: "700",
  },

  resultItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  resultItem: {
    flex: 1,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "700",
    color: COLORS.green,
  },

  confidenceBadge: {
    backgroundColor: COLORS.greenSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },

  confidenceText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.green,
  },

  resultBin: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 5,
  },

  resultDesc: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    fontWeight: "500",
  },

  municipalityBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    fontSize: 13,
    color: COLORS.purple,
    fontWeight: "700",
    backgroundColor: COLORS.purpleSoft,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },

  rulesCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  rulesCol: {
    flex: 1,
  },

  rulesDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  rulesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 9,
  },

  rulesTitleRed: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 9,
  },

  rulesItem: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
    marginBottom: 5,
    fontWeight: "600",
  },

  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.purple,
  },

  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  tipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.purple,
  },

  tipText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 21,
    fontWeight: "600",
  },

  buttonsRow: {
    flexDirection: "row",
    columnGap: 10,
    paddingHorizontal: SPACING.lg,
    paddingTop: 10,
    paddingBottom: 12,
    marginBottom: 96,
  },

  mainBtn: {
    flex: 1,
    minHeight: 58,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  mainBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },

  secondBtn: {
    flex: 1,
    minHeight: 58,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.purple,
  },

  secondBtnText: {
    color: COLORS.purple,
    fontWeight: "700",
    fontSize: 16,
  },

  btnDisabled: {
    opacity: 0.5,
  },

  permText: {
    textAlign: "center",
    marginHorizontal: 36,
    marginTop: 80,
    marginBottom: 22,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    fontWeight: "600",
  },

  permBtn: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    marginHorizontal: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  permBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },

  loadingBinsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  manualContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 26,
  },

  manualInput: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 16,
  },
});
