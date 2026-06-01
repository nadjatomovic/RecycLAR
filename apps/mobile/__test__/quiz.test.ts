import { describe, it, expect } from "@jest/globals";

// Simulacija strukture iz tvojega QuizScreen
type TopicProgress = {
  currentLevel: number;
  levelPoints: number;
  completedLevels: number[];
};

const LEVELS = [
  { level: 1, pointsToUnlock: 50 },
  { level: 2, pointsToUnlock: 70 },
  { level: 3, pointsToUnlock: 90 },
];

// 1. Funkcija za preverjanje, ali je nivo odklenjen
const isLevelUnlocked = (progress: TopicProgress, level: number): boolean => {
  if (level === 1) return true;
  return (
    progress.completedLevels.includes(level - 1) ||
    progress.currentLevel >= level
  );
};

// 2. Funkcija za izračun odstotka napredka
const getLevelProgressPercent = (progress: TopicProgress): number => {
  const levelObj = LEVELS.find((l) => l.level === progress.currentLevel);
  if (!levelObj) return 0;
  return Math.min(100, (progress.levelPoints / levelObj.pointsToUnlock) * 100);
};

// 3. Funkcija za dinamično težavnost vprašanj (Prilagodljiva težavnost)
const getQuestionLevel = (progress: TopicProgress, level: number): number => {
  const levelObj = LEVELS.find((l) => l.level === level);
  if (!levelObj) return level;

  const percent = (progress.levelPoints / levelObj.pointsToUnlock) * 100;

  if (
    percent < 30 &&
    level > 1 &&
    progress.completedLevels.includes(level - 1)
  ) {
    return level - 1; // Uporabniku ponudi lažji nivo za ponovitev
  }
  if (percent > 80 && level < 10) {
    return level + 1; // Uporabniku ponudi težji nivo kot izziv
  }
  return level;
};

// ─── JEST UNIT TESTI ────────────────────────────────────────

describe("Logika za Eko Kviz (RecycLAR)", () => {
  describe("Preverjanje odklenjenih nivojev (isLevelUnlocked)", () => {
    it("mora vedno dovoliti dostop do Nivoja 1 (Začetnik)", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 1,
        levelPoints: 0,
        completedLevels: [],
      };
      expect(isLevelUnlocked(mockProgress, 1)).toBe(true);
    });

    it("mora zakleniti Nivo 2, če uporabnik ni dokončal predhodnega nivoja", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 1,
        levelPoints: 10,
        completedLevels: [],
      };
      expect(isLevelUnlocked(mockProgress, 2)).toBe(false);
    });

    it("mora odkleniti Nivo 2, če je ta v seznamu dokončanih nivojev", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 1,
        levelPoints: 0,
        completedLevels: [1],
      };
      expect(isLevelUnlocked(mockProgress, 2)).toBe(true);
    });
  });

  describe("Izračun odstotka napredka (getLevelProgressPercent)", () => {
    it("mora natančno izračunati 50% napredka za Nivo 1 (25 od 50 točk)", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 1,
        levelPoints: 25,
        completedLevels: [],
      };
      expect(getLevelProgressPercent(mockProgress)).toBe(50);
    });

    it("ne sme dovoliti, da odstotek preseže 100%", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 1,
        levelPoints: 100,
        completedLevels: [],
      };
      expect(getLevelProgressPercent(mockProgress)).toBe(100);
    });
  });

  describe("Prilagodljiva težavnost (getQuestionLevel)", () => {
    it("mora uporabniku ponuditi lažji nivo, če ima manj kot 30% uspeha na trenutnem nivoju", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 2,
        levelPoints: 5,
        completedLevels: [1],
      };
      // Pričakujemo vrnitev na nivo 1 za ponovitev, ker ima le 5 točk na nivoju 2
      expect(getQuestionLevel(mockProgress, 2)).toBe(1);
    });

    it("mora uporabniku ponuditi težji nivo (izziv), če je presegel 80% trenutnega nivoja", () => {
      const mockProgress: TopicProgress = {
        currentLevel: 1,
        levelPoints: 45,
        completedLevels: [],
      }; // 45/50 = 90%
      // Pričakujemo, da bo ponudil vprašanja iz nivoja 2 kot izziv
      expect(getQuestionLevel(mockProgress, 1)).toBe(2);
    });
  });
});
