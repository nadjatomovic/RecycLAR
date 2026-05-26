export const avatarAssets: Record<string, any> = {
  fox: require("../assets/avatarLisica.png"),
  raccoon: require("../assets/avatarRakun.png"),
  hedgehog: require("../assets/avatarJez.png"),
  turtle: require("../assets/avatarKornjaca.png"),
  rabbit: require("../assets/avatarZec.png"),
  owl: require("../assets/avatarSova.png"),

  lari: require("../assets/lari-hello.png"),
};

export function getAvatarAsset(avatarKey?: string) {
  if (!avatarKey) return avatarAssets.lari;
  return avatarAssets[avatarKey] ?? avatarAssets.lari;
}
