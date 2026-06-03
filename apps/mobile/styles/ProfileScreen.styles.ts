import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 6 : 10,
    paddingBottom: 88,
  },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "700",
  },

  emptyText: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "600",
  },

  loginBtn: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },

  loginBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 48,
    height: 48,
    marginRight: 10,
  },

  brandText: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  brandGreen: {
    color: COLORS.green,
  },

  brandPurple: {
    color: COLORS.purple,
  },

  notificationBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  notificationText: {
    fontSize: 22,
  },

  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  notificationDotText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "700",
  },

  screenTitle: {
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 18,
    letterSpacing: -0.9,
  },

  profileCard: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: isSmallPhone ? 14 : 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  avatarWrap: {
    width: isSmallPhone ? 88 : 96,
    height: isSmallPhone ? 88 : 96,
    borderRadius: isSmallPhone ? 44 : 48,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: isSmallPhone ? 44 : 48,
  },

  avatarOuter: {
    width: isSmallPhone ? 96 : 104,
    height: isSmallPhone ? 96 : 104,
    marginRight: 13,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  name: {
    flex: 1,
    fontSize: isSmallPhone ? 25 : 28,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: 8,
    letterSpacing: -0.5,
  },

  profileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  metaBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  metaEmoji: {
    fontSize: 17,
    marginRight: 5,
  },

  metaLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 2,
    fontWeight: "700",
  },

  metaValue: {
    fontSize: isSmallPhone ? 13 : 14,
    lineHeight: isSmallPhone ? 17 : 18,
    color: COLORS.purple,
    fontWeight: "700",
    flexShrink: 1,
  },

  metaDivider: {
    width: 1,
    height: 38,
    backgroundColor: COLORS.border,
    marginHorizontal: 7,
  },

  teacherMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  teacherMetaEmoji: {
    fontSize: 16,
    marginRight: 7,
  },

  teacherMetaText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statCard: {
    width: (width - 62) / 4,
    minHeight: isSmallPhone ? 112 : 122,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  statIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  statIcon: {
    fontSize: 22,
  },

  statLabel: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "700",
  },

  statValue: {
    fontSize: 22,
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },

  viewAll: {
    fontSize: 14,
    color: COLORS.purple,
    fontWeight: "700",
  },

  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },

  badgeItem: {
    width: "31%",
    alignItems: "center",
  },

  lockedBadgeItem: {
    opacity: 0.6,
  },

  badgeImageWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.purpleSoft,
    borderWidth: 2,
    borderColor: "#D8C8F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },

  badgeImage: {
    width: 82,
    height: 82,
  },

  lockedImage: {
    opacity: 0.38,
  },

  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  lockIcon: {
    fontSize: 22,
  },

  badgeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
    minHeight: 34,
  },

  badgeDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.muted,
    textAlign: "center",
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },

  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  activityIconEmoji: {
    fontSize: 20,
  },

  activityTextWrap: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },

  activityDescription: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  activityRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  activityPoints: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },

  activityTime: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 61,
  },

  classRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  classCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  classCircleText: {
    fontSize: 14,
    fontWeight: "700",
  },

  classInfo: {
    flex: 1,
  },

  className: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  classPoints: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    fontWeight: "600",
  },

  classMedal: {
    fontSize: 20,
    marginRight: 8,
  },

  classArrow: {
    fontSize: 22,
    color: COLORS.lightText,
    fontWeight: "700",
  },

  signOutBtn: {
    marginTop: 2,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  signOutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: height * 0.72,
  },

  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#DDDDE6",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  modalSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 18,
    lineHeight: 20,
  },

  avatarOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 18,
  },

  avatarOption: {
    width: "48%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F8F8FB",
    alignItems: "center",
    paddingVertical: 16,
  },

  avatarOptionActive: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.purpleSoft,
  },

  avatarOptionImage: {
    width: 78,
    height: 78,
    marginBottom: 8,
  },

  avatarOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "700",
  },

  modalCloseBtn: {
    minHeight: 52,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseText: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: "700",
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  textInput: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F8F8FB",
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 18,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },

  cancelBtn: {
    flex: 1,
    minHeight: 52,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelBtnText: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "700",
  },

  saveBtn: {
    flex: 1,
    minHeight: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.white,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  cameraBadgeText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },

  editIcon: {
    fontSize: 24,
    color: COLORS.purple,
    fontWeight: "700",
  },

  notificationsList: {
    marginBottom: 18,
  },

  notificationItem: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F8F8FB",
    padding: 12,
    marginBottom: 10,
  },

  notificationItemUnread: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: "#D8C8F8",
  },

  notificationItemIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  notificationItemEmoji: {
    fontSize: 20,
  },

  notificationItemContent: {
    flex: 1,
  },

  notificationItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },

  notificationItemMessage: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
    fontWeight: "600",
    marginBottom: 5,
  },

  notificationItemTime: {
    fontSize: 11,
    color: COLORS.purple,
    fontWeight: "700",
  },

  emptyNotificationsBox: {
    alignItems: "center",
    paddingVertical: 22,
    marginBottom: 12,
  },

  emptyNotificationsIcon: {
    fontSize: 34,
    marginBottom: 8,
  },

  emptyNotificationsTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  emptyNotificationsText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "600",
  },

  metaTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  unreadMiniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple,
    marginLeft: 8,
    marginTop: 6,
  },

  notificationChevron: {
    fontSize: 26,
    color: COLORS.purple,
    fontWeight: "700",
    marginLeft: 6,
    alignSelf: "center",
  },

  notificationDetailIcon: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  notificationDetailEmoji: {
    fontSize: 36,
  },

  notificationDetailTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },

  notificationDetailMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },

  notificationDetailTime: {
    fontSize: 13,
    color: COLORS.purple,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  notificationDetailCloseBtn: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  notificationDetailCloseText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "700",
  },

  notificationsModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: "86%",
  },

  notificationsTabs: {
    flexDirection: "row",
    backgroundColor: "#F7F7FA",
    borderRadius: 16,
    padding: 5,
    marginTop: 14,
    marginBottom: 14,
  },

  notificationTab: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  notificationTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  notificationTabText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
  },

  notificationTabTextActive: {
    color: COLORS.purple,
    fontWeight: "700",
  },

  notificationTabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
    paddingHorizontal: 5,
  },

  notificationTabBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },

  notificationsScroll: {
    maxHeight: 390,
  },

  notificationsScrollContent: {
    paddingBottom: 8,
  },

  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  notificationBackBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 8,
  },

  notificationBackText: {
    fontSize: 16,
    color: COLORS.purple,
    fontWeight: "700",
  },
});
