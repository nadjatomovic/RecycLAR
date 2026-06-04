export const iconAssets: Record<string, any> = {
  scan: require("../assets/scan.png"),
  quiz: require("../assets/quiz.png"),
  barcode: require("../assets/barcode .png"),
  eco: require("../assets/eco.png"),
  location: require("../assets/location.png"),
  notification: require("../assets/notification.png"),
  trophy: require("../assets/trophy.png"),
  school: require("../assets/school.png"),
  streak: require("../assets/streak.png"),

  teacherProfile: require("../assets/profilnaUcitelj.png"),
  teacherStudents: require("../assets/ucenici.png"),
};

export function getIconAsset(iconKey?: string) {
  if (!iconKey) return iconAssets.eco;
  return iconAssets[iconKey] ?? iconAssets.eco;
}
