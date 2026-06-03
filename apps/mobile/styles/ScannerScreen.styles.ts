import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
},

lariImg: {
    width: 120,
    height: 140,
    resizeMode: 'contain',
},

tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
    gap: 8,
},

tipLari: {
    width: 90,
    height: 100,
    resizeMode: 'contain',
    flexShrink: 0,
},

tipCard: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 14,
},

tipTitle: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
},

tipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
},

cameraBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
},

titleRow: {
    display: 'none',
},

statusRow: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
},

camera: {
    flex: 1,
},

mainBtn: {
    flex: 1,
    height: 56,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
},

secondBtn: {
    flex: 1,
    height: 56,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
},

secondBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
},
  // ── Header floats over camera ──────────────────────────────────────────────
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 8,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 36,
    lineHeight: 36,
    color: COLORS.white,
    marginTop: -4,
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: COLORS.white,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  headerGreen: {
    color: COLORS.green,
  },

  headerPurple: {
    color: COLORS.white,
  },

  // ── titleRow hidden — camera is fullscreen ─────────────────────────────────

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

  // ── Status badge floats top-right ──────────────────────────────────────────
  
  statusDot: {
    fontSize: 12,
    marginRight: 6,
  },

  statusText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "700",
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  // ── Corner brackets — white, 3 px, 24 px ──────────────────────────────────
cornerTL: { display: 'none' },
cornerTR: { display: 'none' },
cornerBL: { display: 'none' },
cornerBR: { display: 'none' },


  resultsScroll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    maxHeight: '60%',
},

resultsContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 120,
},

buttonsRow: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 30,
    flexDirection: 'row',
    gap: 12,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingBinsText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "700",
  },

  // ── Bottom sheet result ────────────────────────────────────────────────────
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 12,
  },

  resultCard: {
    marginBottom: 12,
  },

  resultLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
    marginTop: 4,
    fontWeight: "600",
  },

  resultItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  resultItem: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: "#111827",
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
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
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


  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  // ── Floating buttons ───────────────────────────────────────────────────────

  mainBtnText: {
    color: COLORS.white,
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
