export const binAssets: Record<string, any> = {
  zutaKanta: require("../assets/zutaKanta.png"),
  modraKanta: require("../assets/plavaKanta.png"),
  zelenaKanta: require("../assets/zelenaKanta.png"),
  rjavaKanta: require("../assets/braonKanta.png"),
  crnaKanta: require("../assets/crnaKanta.png"),
  sivaKanta: require("../assets/sivaKanta.png"),
  rdecaKanta: require("../assets/crvenaKanta.png"),
  belaKanta: require("../assets/belaKanta.png"),
  kantaZRumenimPokrovom: require("../assets/zutiPoklopac.png"),
  specialDropoff: require("../assets/posebniOdpatki.png"),
};

export function getBinAsset(imageKey?: string) {
  if (!imageKey) return binAssets.crnaKanta;
  return binAssets[imageKey] ?? binAssets.crnaKanta;
}