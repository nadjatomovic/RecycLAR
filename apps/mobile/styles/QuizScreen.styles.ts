import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

const { height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 8 : 14,
    paddingBottom: 120,
  },

  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: COLORS.white,
  },

  lockedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  lockedTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },

  lockedText: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 26,
    fontWeight: "600",
  },

  purpleButton: {
    backgroundColor: COLORS.purple,
    paddingVertical: 16,
    borderRadius: RADIUS.pill,
    width: "100%",
    alignItems: "center",
  },

  purpleButtonText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 16,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.muted,
    fontWeight: "700",
    fontSize: 15,
  },

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: isSmallPhone ? 32 : 36,
    lineHeight: isSmallPhone ? 38 : 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginTop: 4,
    fontWeight: "500",
  },

  pointsPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.pill,
  },

  pointsText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#D97706",
  },

  teacherButton: {
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
  },

  teacherButtonActive: {
    backgroundColor: "#1F2937",
  },

  teacherButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },

  teacherIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  teacherTitle: {
    fontWeight: "900",
    fontSize: 14,
  },

  teacherTitleActive: {
    color: COLORS.white,
  },

  teacherTitleDisabled: {
    color: COLORS.muted,
  },

  teacherSub: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },

  teacherProgress: {
    color: COLORS.purple,
    fontSize: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 22,
    marginBottom: 12,
  },

  topicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  topicStripe: {
    height: 6,
  },

  topicInner: {
    padding: 18,
  },

  topicTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  topicEmojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  topicEmoji: {
    fontSize: 27,
  },

  topicLabel: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },

  topicLevel: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  topicPointsPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },

  topicPointsText: {
    fontSize: 12,
    fontWeight: "900",
  },

  progressTrack: {
    height: 9,
    backgroundColor: "#EEF0F4",
    borderRadius: 999,
    marginBottom: 7,
    overflow: "hidden",
  },

  progressFill: {
    height: 9,
    borderRadius: 999,
  },

  progressInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressSmallText: {
    fontSize: 11,
    color: COLORS.lightText,
    fontWeight: "600",
  },

  pathHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  pathBack: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F7F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  pathBackText: {
    fontSize: 24,
    color: COLORS.muted,
    fontWeight: "900",
  },

  pathEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  pathEmoji: {
    fontSize: 23,
  },

  pathTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
  },

  pathSubtitle: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },

  pathPointsPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },

  pathPointsText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D97706",
  },

  pathContent: {
    paddingTop: isSmallPhone ? 10 : 16,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 130,
  },

  levelNode: {
    justifyContent: "center",
    alignItems: "center",
  },

  levelStars: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },

  levelCircle: {
    justifyContent: "center",
    alignItems: "center",
  },

  levelEmoji: {
    fontSize: 28,
  },

  levelProgressWrap: {
    marginTop: 7,
    width: 90,
  },

  levelProgressTrack: {
    height: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },

  levelProgressFill: {
    height: 5,
    borderRadius: 3,
  },

  levelProgressText: {
    fontSize: 10,
    color: COLORS.lightText,
    textAlign: "center",
    marginTop: 3,
    fontWeight: "700",
  },

  levelLabelWrap: {
    marginTop: 6,
    alignItems: "center",
    width: 92,
  },

  levelNumber: {
    fontSize: 11,
    color: COLORS.lightText,
    textAlign: "center",
  },

  levelLabel: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  levelPoints: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },

  quizHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: 8,
  },

  quizProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  closeQuizBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F7F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  closeQuizText: {
    fontSize: 22,
    color: COLORS.muted,
    fontWeight: "900",
  },

  quizProgressTrack: {
    flex: 1,
    height: 11,
    backgroundColor: "#EEF0F4",
    borderRadius: 999,
    overflow: "hidden",
  },

  quizProgressFill: {
    height: 11,
    borderRadius: 999,
  },

  quizPointsPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    marginLeft: 10,
  },

  quizPointsText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#D97706",
  },

  quizContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 150,
  },

  quizMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  quizMetaText: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginRight: 8,
  },

  smallBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
  },

  smallBadgeText: {
    fontSize: 10,
    fontWeight: "900",
  },

  questionText: {
    fontSize: isSmallPhone ? 22 : 24,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: isSmallPhone ? 30 : 33,
    marginBottom: 26,
    letterSpacing: -0.3,
  },

  answerCard: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
  },

  answerLetterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  answerLetter: {
    fontSize: 14,
    fontWeight: "900",
  },

  answerText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },

  infoBox: {
    borderRadius: 16,
    padding: 14,
    marginTop: 5,
    marginBottom: 9,
    flexDirection: "row",
  },

  infoIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  infoText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
    fontWeight: "600",
  },

  quizBottomAction: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 86,
    paddingHorizontal: SPACING.lg,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  actionButton: {
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: "center",
  },

  actionButtonText: {
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.4,
  },

  resultContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 24,
    paddingBottom: 120,
    alignItems: "center",
  },

  unlockBanner: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    padding: 16,
    width: "100%",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#D97706",
    alignItems: "center",
  },

  unlockEmoji: {
    fontSize: 34,
  },

  unlockTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#D97706",
    textAlign: "center",
  },

  unlockSubtitle: {
    fontSize: 13,
    color: "#92400E",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "700",
  },

  resultEmoji: {
    fontSize: 78,
    marginBottom: 8,
  },

  resultTitle: {
    fontSize: 29,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },

  resultSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
    fontWeight: "600",
  },

  statsCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 22,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    fontWeight: "700",
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  resultProgressCard: {
    borderRadius: 18,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
  },

  resultProgressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  resultProgressTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  resultProgressPoints: {
    fontSize: 13,
    fontWeight: "900",
  },

  resultProgressTrack: {
    height: 9,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },

  resultProgressFill: {
    height: 9,
    borderRadius: 999,
  },

  resultProgressText: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 7,
    fontWeight: "600",
  },

  resultPrimaryButton: {
    borderRadius: RADIUS.pill,
    paddingVertical: 17,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },

  resultPrimaryText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 16,
  },

  resultSecondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },

  resultSecondaryText: {
    color: COLORS.muted,
    fontWeight: "900",
    fontSize: 15,
  },

  resultOutlineButton: {
    borderWidth: 2,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  resultOutlineText: {
    fontWeight: "900",
    fontSize: 15,
  },

  pathHeaderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 26,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  pathHeaderText: {
    flex: 1,
  },

  pathHeroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  pathHeroTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  pathHeroOverline: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  pathHeroTitle: {
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.4,
    marginBottom: 6,
  },

  pathHeroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
    fontWeight: "600",
  },

  pathLari: {
    width: isSmallPhone ? 86 : 102,
    height: isSmallPhone ? 86 : 102,
    marginRight: -6,
  },

  levelMap: {
    position: "relative",
    paddingTop: 4,
  },

  pathStep: {
    position: "relative",
    marginBottom: 2,
  },

  stepContentRow: {
    width: "100%",
    alignItems: "flex-start",
  },

  stepContentRowRight: {
    alignItems: "flex-end",
  },

  levelPathCard: {
    width: "82%",
    minHeight: 132,
    backgroundColor: COLORS.white,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  levelPathCardLocked: {
    backgroundColor: "#F7F7FA",
    borderColor: "#E5E7EB",
    shadowOpacity: 0.03,
  },

  levelPathIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    borderWidth: 3,
    borderColor: COLORS.white,
  },

  levelPathEmoji: {
    fontSize: 27,
    fontWeight: "900",
    color: COLORS.white,
  },

  levelPathInfo: {
    flex: 1,
  },

  levelPathTopRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 3,
  },

  levelPathNumber: {
    fontSize: 12,
    color: COLORS.lightText,
    fontWeight: "900",
    marginRight: 7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  levelPathTitle: {
    fontSize: 20,
    lineHeight: 25,
    color: COLORS.text,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  levelPathTitleLocked: {
    color: "#9CA3AF",
  },

  levelPathReward: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
    marginBottom: 8,
  },

  levelPathProgressTrack: {
    height: 7,
    backgroundColor: "#EEF0F4",
    borderRadius: 999,
    overflow: "hidden",
  },

  levelPathProgressFill: {
    height: 7,
    borderRadius: 999,
  },

  levelPathProgressText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 5,
  },

  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  currentBadgeText: {
    fontSize: 10,
    fontWeight: "900",
  },

  doneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
  },

  doneBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#16A34A",
  },

  dottedConnector: {
    height: 54,
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 2,
  },

  connectorDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  miniLariGuide: {
    position: "absolute",
    width: 52,
    height: 52,
    top: -34,
    zIndex: 10,
  },

  miniLariRight: {
    right: -6,
  },

  miniLariLeft: {
    left: -6,
  },

  leaderboardBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#E0D4F7",
    shadowColor: COLORS.purple,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  leaderboardBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leaderboardBannerEmoji: {
    fontSize: 32,
    marginRight: 4,
  },
  leaderboardBannerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  leaderboardBannerSub: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 2,
  },
  leaderboardBannerChevron: {
    fontSize: 24,
    color: COLORS.purple,
    fontWeight: "900",
  },
  zigzagStep: {
  width: "100%",
  alignItems: "center",
  marginBottom: 0,
},

zigzagNodeRow: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
},

zigzagNodeRowLeft: {
  justifyContent: "flex-start",
},

zigzagNodeRowRight: {
  justifyContent: "flex-end",
},

levelBubble: {
  width: "78%",
  minHeight: 118,
  borderRadius: 34,
  backgroundColor: COLORS.white,
  borderWidth: 2,
  borderColor: COLORS.border,
  padding: 13,
  flexDirection: "row",
  alignItems: "center",
  position: "relative",

  shadowColor: COLORS.shadow,
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 7 },
  elevation: 4,
},

levelBubbleDone: {
  backgroundColor: "#F0FDF4",
  borderColor: "#BBF7D0",
},

levelBubbleLocked: {
  backgroundColor: "#F8F8FB",
  borderColor: "#E5E7EB",
  shadowOpacity: 0.03,
},

levelCircleBig: {
  width: 74,
  height: 74,
  borderRadius: 37,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 13,
  borderWidth: 4,
  borderColor: COLORS.white,
},

levelCircleEmoji: {
  fontSize: 32,
  fontWeight: "900",
  color: COLORS.white,
},

levelBubbleInfo: {
  flex: 1,
  minWidth: 0,
},

levelBubbleTop: {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 3,
},

levelBubbleNumber: {
  fontSize: 12,
  color: COLORS.lightText,
  fontWeight: "900",
  marginRight: 7,
  letterSpacing: 0.5,
},

levelDonePill: {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 999,
  backgroundColor: "#DCFCE7",
},

levelDonePillText: {
  fontSize: 10,
  fontWeight: "900",
  color: "#16A34A",
},

levelCurrentPill: {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 999,
},

levelCurrentPillText: {
  fontSize: 10,
  fontWeight: "900",
},

levelBubbleTitle: {
  fontSize: 22,
  lineHeight: 27,
  color: COLORS.text,
  fontWeight: "900",
  letterSpacing: -0.3,
},

levelBubbleTitleLocked: {
  color: "#9CA3AF",
},

levelBubbleReward: {
  fontSize: 13,
  fontWeight: "800",
  marginTop: 3,
  marginBottom: 8,
},

levelBubbleProgressTrack: {
  height: 7,
  backgroundColor: "#EEF0F4",
  borderRadius: 999,
  overflow: "hidden",
},

levelBubbleProgressFill: {
  height: 7,
  borderRadius: 999,
},

levelBubbleProgressText: {
  fontSize: 11,
  color: COLORS.muted,
  fontWeight: "700",
  marginTop: 5,
},

zigzagConnectorWrap: {
  width: "42%",
  height: 64,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: -2,
},

connectorLeftToRight: {
  alignSelf: "center",
  transform: [{ rotate: "26deg" }],
},

connectorRightToLeft: {
  alignSelf: "center",
  transform: [{ rotate: "-26deg" }],
},

zigzagConnectorDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
},

zigzagLari: {
  position: "absolute",
  width: 54,
  height: 54,
  top: -34,
  zIndex: 10,
},

zigzagLariRight: {
  right: -4,
},

zigzagLariLeft: {
  left: -4,
},

duoStep: {
  width: "100%",
  minHeight: 190,
  position: "relative",
},

duoStepInner: {
  width: 120,
  alignItems: "center",
  position: "absolute",
  top: 0,
},

duoNode: {
  width: 84,
  height: 84,
  borderRadius: 42,
  backgroundColor: COLORS.white,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 4,
  borderColor: "#E5E7EB",

  shadowColor: COLORS.shadow,
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
},

duoNodeCurrent: {
  width: 96,
  height: 96,
  borderRadius: 48,
},

duoNodeDone: {
  borderColor: "#86EFAC",
  backgroundColor: "#F0FDF4",
},

duoNodeLocked: {
  backgroundColor: "#F3F4F6",
  borderColor: "#E5E7EB",
},

duoNodeInner: {
  width: 64,
  height: 64,
  borderRadius: 32,
  justifyContent: "center",
  alignItems: "center",
},

duoNodeEmoji: {
  fontSize: 30,
  color: "#FFFFFF",
  fontWeight: "900",
},

duoLari: {
  position: "absolute",
  width: 48,
  height: 48,
  right: -6,
  top: -20,
  zIndex: 5,
},

duoLevelMini: {
  marginTop: 8,
  fontSize: 11,
  fontWeight: "900",
  color: COLORS.lightText,
  textTransform: "uppercase",
  letterSpacing: 0.6,
  textAlign: "center",
},

duoLevelTitle: {
  marginTop: 2,
  fontSize: 18,
  fontWeight: "900",
  color: COLORS.text,
  textAlign: "center",
},

duoLevelMeta: {
  marginTop: 2,
  fontSize: 12,
  fontWeight: "800",
  textAlign: "center",
},

duoConnector: {
  position: "absolute",
  top: 118,
  left: "35%",
  height: 74,
  width: 120,
  justifyContent: "space-between",
  alignItems: "center",
},

duoConnectorDot: {
  width: 10,
  height: 10,
  borderRadius: 5,
},

answerFeedbackCard: {
  marginTop: 8,
  marginBottom: 18,
  borderRadius: 24,
  borderWidth: 1.5,
  paddingVertical: 10,
  paddingHorizontal: 14,
  alignItems: "center",
},

answerFeedbackAnimation: {
  width: 155,
  height: 155,
  backgroundColor: "transparent",
  marginBottom: -8,
},

answerFeedbackText: {
  marginTop: 0,
  fontSize: 13,
  lineHeight: 18,
  color: COLORS.muted,
  fontWeight: "700",
  textAlign: "center",
},

  feedbackOverlayRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  feedbackBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  feedbackCard: {
    width: "100%",
    borderRadius: 34,
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
    alignItems: "center",
    borderWidth: 2,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  feedbackCardCorrect: {
    borderColor: "#86EFAC",
  },

  feedbackCardWrong: {
    borderColor: "#FCA5A5",
  },

  feedbackAnimationLarge: {
    width: isSmallPhone ? 250 : 300,
    height: isSmallPhone ? 250 : 300,
    backgroundColor: "transparent",
    marginBottom: -8,
  },

  feedbackTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.4,
  },

  feedbackSubtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.muted,
    fontWeight: "700",
    textAlign: "center",
  },

  feedbackNextButton: {
    width: "100%",
    borderRadius: RADIUS.pill,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  feedbackNextButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  feedbackConfettiLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  feedbackConfetti: {
    position: "absolute",
    fontSize: 34,
    opacity: 0.95,
  },

  feedbackWrongPatternLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  feedbackWrongPatternText: {
    position: "absolute",
    fontSize: 42,
    fontWeight: "900",
    color: "rgba(239,68,68,0.18)",
  },

  resultOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

resultCard: {
  width: "100%",
  borderRadius: 32,
  borderWidth: 3,
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 20,
  paddingTop: 22,
  paddingBottom: 24,
  alignItems: "center",

  shadowColor: COLORS.shadow,
  shadowOpacity: 0.18,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 12 },
  elevation: 8,
},

resultLottie: {
  width: 260,
  height: 260,
  backgroundColor: "transparent",
  marginBottom: -8,
},

resultFeedbackTitle: {
  fontSize: 34,
  fontWeight: "900",
  textAlign: "center",
  letterSpacing: -0.5,
  marginBottom: 6,
},

resultFeedbackSubtitle: {
  fontSize: 17,
  lineHeight: 24,
  color: COLORS.muted,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 24,
},

resultNextButton: {
  width: "100%",
  borderRadius: 999,
  paddingVertical: 18,
  alignItems: "center",
  justifyContent: "center",
},

resultNextButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "900",
  letterSpacing: 0.4,
},

});
