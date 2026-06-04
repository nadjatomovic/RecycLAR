import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

const { height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 6 : 10,
    paddingBottom: 96,
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
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 42,
    height: 42,
    marginRight: 8,
  },

  brandText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  brandGreen: {
    color: COLORS.green,
  },

  brandPurple: {
    color: COLORS.purple,
  },

  headerSpacer: {
    width: 44,
  },

  screenTitle: {
    fontSize: isSmallPhone ? 30 : 34,
    lineHeight: isSmallPhone ? 36 : 40,
    color: COLORS.text,
    fontWeight: "700",
    letterSpacing: -0.8,
  },

  screenSubtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },

  summaryCard: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryValue: {
    fontSize: 21,
    color: COLORS.purple,
    fontWeight: "700",
  },

  summaryLabel: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
  },

  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: COLORS.border,
  },

  sectionCard: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },

  sectionHint: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.purple,
  },

  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  rankCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rankText: {
    fontSize: 14,
    color: COLORS.purple,
    fontWeight: "700",
  },

  studentInfo: {
    flex: 1,
  },

  studentName: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 3,
  },

  studentMeta: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  studentPointsBox: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  studentPoints: {
    fontSize: 17,
    color: COLORS.green,
    fontWeight: "700",
  },

  studentPointsLabel: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 50,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 26,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
    opacity: 0.75,
  },

  emptyTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    fontWeight: "600",
    textAlign: "center",
  },

  inviteCodeCard: {
  borderRadius: 18,
  backgroundColor: "#F3ECFF",
  borderWidth: 1,
  borderColor: "#D8C8F8",
  padding: 16,
  marginBottom: 18,
  flexDirection: "row",
  alignItems: "center",

  shadowColor: COLORS.shadow,
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
},

inviteCodeIconCircle: {
  width: 54,
  height: 54,
  borderRadius: 27,
  backgroundColor: COLORS.white,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 14,
},

inviteCodeIcon: {
  fontSize: 24,
},

inviteCodeContent: {
  flex: 1,
},

inviteCodeLabel: {
  fontSize: 13,
  color: COLORS.muted,
  fontWeight: "700",
  marginBottom: 2,
},

inviteCodeValue: {
  fontSize: 24,
  color: COLORS.purple,
  fontWeight: "700",
  letterSpacing: 0.5,
  marginBottom: 4,
},

inviteCodeHelp: {
  fontSize: 12,
  lineHeight: 17,
  color: COLORS.muted,
  fontWeight: "600",
},

});