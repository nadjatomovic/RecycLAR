import { describe, it, expect } from "@jest/globals";

// ─── Реплика на твојата логика од ScannerScreen.tsx ──────────────────────────
const mapTextToBinType = (item: string): string => {
  const lower = item.toLowerCase();

  if (
    lower.includes("paper") ||
    lower.includes("papir") ||
    lower.includes("cardboard") ||
    lower.includes("karton")
  )
    return "paper";

  if (
    lower.includes("plastic") ||
    lower.includes("plastik") ||
    lower.includes("embalaža") ||
    lower.includes("metal") ||
    lower.includes("kovina") ||
    lower.includes("pločevin")
  )
    return "packaging";

  if (lower.includes("glass") || lower.includes("steklo")) return "glass";

  if (
    lower.includes("food") ||
    lower.includes("bio") ||
    lower.includes("organic") ||
    lower.includes("hrana")
  )
    return "bio";

  return "mixed";
};

// ─── JEST UNIT ТЕСТОВИ ──────────────────────────────────────────────────────

describe("Logika za skeniranje (ScannerScreen)", () => {
  describe("Razvrščanje odpadkov (mapTextToBinType)", () => {
    it("mora pravilno prepoznati papir/karton", () => {
      expect(mapTextToBinType("stari papir")).toBe("paper");
      expect(mapTextToBinType("škatla iz kartona")).toBe("paper");
      expect(mapTextToBinType("cardboard box")).toBe("paper");
    });

    it("mora pravilno prepoznati plastično embalažo in kovino", () => {
      // Овие зборови ги имаш во твојот код
      expect(mapTextToBinType("plastic")).toBe("packaging");
      expect(mapTextToBinType("kovina")).toBe("packaging");
      expect(mapTextToBinType("pločevina")).toBe("packaging"); // "pločevin" се содржи во "pločevina"
      expect(mapTextToBinType("embalaža")).toBe("packaging");
    });

    it("mora pravilno prepoznati steklo", () => {
      expect(mapTextToBinType("steklo")).toBe("glass");
      expect(mapTextToBinType("glass bottle")).toBe("glass");
    });

    it("mora pravilno prepoznati bio odpadke", () => {
      expect(mapTextToBinType("hrana")).toBe("bio");
      expect(mapTextToBinType("organic waste")).toBe("bio");
    });

    it("mora za neznan odpadek vrniti 'mixed'", () => {
      expect(mapTextToBinType("kamen")).toBe("mixed");
      expect(mapTextToBinType("neznan predmet")).toBe("mixed");
    });
  });
});
