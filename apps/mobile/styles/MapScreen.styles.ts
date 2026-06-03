import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme";

const { height } = Dimensions.get("window");
const isSmallPhone = height < 720;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: isSmallPhone ? 4 : 8,
    marginBottom: 8,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandText: {
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  brandGreen: {
    color: COLORS.green,
  },

  brandPurple: {
    color: COLORS.purple,
  },

  cityPill: {
    backgroundColor: COLORS.purpleSoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },

  cityPillText: {
    color: COLORS.purple,
    fontWeight: "700",
    fontSize: 14,
  },

  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: SPACING.lg,
    marginBottom: 12,
  },

  titleTextWrap: {
    flex: 1,
  },

  mainTitle: {
    fontSize: isSmallPhone ? 24 : 28,
    lineHeight: isSmallPhone ? 30 : 34,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.8,
  },

  subTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    fontWeight: "500",
  },

  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: 12,
    zIndex: 20,
  },

  searchBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    alignItems: "center",
    minHeight: 54,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  searchIcon: {
    fontSize: 22,
    marginRight: 10,
    color: COLORS.muted,
    fontWeight: "700",
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },

  suggestionsBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 6,
    maxHeight: 220,
    overflow: "hidden",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F6",
  },

  suggestionItemLast: {
    borderBottomWidth: 0,
  },

  suggestionText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },

  filtersWrap: {
    height: 42,
    marginBottom: 10,
  },

  filtersContent: {
    paddingHorizontal: SPACING.lg,
    columnGap: 8,
  },

  chip: {
    paddingHorizontal: 15,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F8FB",
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  chipText: {
    color: COLORS.muted,
    fontWeight: "700",
    fontSize: 13,
  },

  chipTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  mapWrapper: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#EFEFF4",
    borderTopWidth: 1,
    borderColor: "#EFF0F4",
    position: "relative",
    paddingBottom: 86,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  mapLoaderText: {
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
  },

  customMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  markerIcon: {
    fontSize: 17,
    color: COLORS.white,
    fontWeight: "700",
  },

  emptyMapCard: {
    position: "absolute",
    top: 24,
    left: 22,
    right: 22,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  emptyMapIcon: {
    fontSize: 28,
    marginBottom: 4,
  },

  emptyMapTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyMapText: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "600",
  },

  infoCard: {
    position: "absolute",
    bottom: 104,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  infoIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoIconText: {
    fontSize: 23,
    color: COLORS.purple,
    fontWeight: "700",
  },

  infoDetails: {
    flex: 1,
    paddingRight: 10,
  },

  closestTag: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  locationTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    color: COLORS.text,
  },

  locationItems: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    fontWeight: "600",
  },

  openStatus: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "700",
    marginTop: 3,
  },

  arrowBtn: {
    backgroundColor: COLORS.purple,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  arrowText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
  },
});
