export const badgeAssets: Record<string, any> = {
  ecoHero: require("../assets/bedzEkoJunak.png"),
  quizMaster: require("../assets/bedzKvizMaster.png"),
  classChampion: require("../assets/bedzNajboljiRazred.png"),
  paperSaver: require("../assets/bedzPapir.png"),
  plasticHunter: require("../assets/bedzPlastika.png"),
  firstScan: require("../assets/bedzprviSken.png"),
  sevenDayStreak: require("../assets/bedzSedamDanaZaRedom.png"),
  glassGuardian: require("../assets/bedzStaklo.png"),
};

export function getBadgeAsset(imageKey?: string) {
  if (!imageKey) return badgeAssets.ecoHero;
  return badgeAssets[imageKey] ?? badgeAssets.ecoHero;
}