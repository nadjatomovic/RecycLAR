import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 6,
    marginBottom: 10,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 44,
    height: 44,
    marginRight: 10,
  },

  brandText: {
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  brandGreen: {
    color: colors.green,
  },

  brandPurple: {
    color: colors.purple,
  },

  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: "relative",
  },

  notificationText: {
    fontSize: 23,
    color: "#4D4D59",
  },

  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purple,
  },

  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    marginBottom: 14,
  },

  titleTextWrap: {
    flex: 1,
  },

  mainTitle: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 18,
    lineHeight: 25,
    color: colors.muted,
  },

  mascotSmall: {
    width: 112,
    height: 112,
    marginTop: -8,
    marginRight: 4,
  },

  searchContainer: {
    paddingHorizontal: 22,
    marginBottom: 14,
  },

  searchBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 18,
    alignItems: "center",
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  searchIcon: {
    fontSize: 24,
    marginRight: 12,
    color: "#6E6E78",
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },

  filterBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  filterText: {
    fontSize: 22,
    color: "#6E6E78",
  },

  mapWrapper: {
    flex: 1,
    marginHorizontal: 0,
    overflow: "hidden",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EFF0F4",
    minHeight: height * 0.44,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  customMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  markerIcon: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "900",
  },

  floatingMapButtons: {
    position: "absolute",
    right: 18,
    bottom: 84,
    gap: 12,
  },

  mapCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  mapCircleIcon: {
    fontSize: 26,
    color: "#686873",
  },

  categoriesOverlay: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    paddingLeft: 18,
  },

  chip: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    marginRight: 9,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  chipActive: {
    backgroundColor: colors.purpleLight,
    borderColor: "#D8C8F8",
  },

  chipIcon: {
    fontSize: 17,
    marginRight: 7,
    fontWeight: "800",
  },

  chipText: {
    fontWeight: "700",
    fontSize: 13,
    color: colors.text,
  },

  chipTextActive: {
    color: colors.purple,
    fontWeight: "900",
  },

  infoCard: {
    position: "absolute",
    bottom: 86,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 14,
  },

  locationImgWrap: {
    width: 104,
    height: 94,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 14,
    position: "relative",
  },

  locationImg: {
    width: "100%",
    height: "100%",
  },

  distanceBadge: {
    position: "absolute",
    left: 10,
    bottom: 8,
    backgroundColor: colors.purple,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  distanceText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },

  infoDetails: {
    flex: 1,
    paddingRight: 42,
  },

  closestTag: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
  },

  locationTitle: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 6,
  },

  typeDotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },

  typeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  locationItems: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },

  openStatus: {
    fontSize: 13,
    color: colors.green,
    fontWeight: "800",
  },

  favoriteBtn: {
    position: "absolute",
    right: 22,
    top: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  favoriteIcon: {
    color: "#777782",
    fontSize: 23,
  },

  arrowBtn: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: colors.purple,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.purple,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  arrowText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
  },

  bottomTab: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#EFEFF4",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabIcon: {
    fontSize: 25,
    color: colors.purple,
    marginBottom: 2,
  },

  tabIconActive: {
    color: colors.green,
  },

  tabLabel: {
    fontSize: 12,
    color: colors.muted,
  },

  tabLabelActive: {
    color: colors.green,
    fontWeight: "900",
  },
});