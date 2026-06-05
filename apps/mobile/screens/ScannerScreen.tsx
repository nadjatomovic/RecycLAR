import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DecorativeBackground from "../components/DecorativeBackground";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import * as ExpoAsset from "expo-asset";
import * as ImageManipulator from "expo-image-manipulator";
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, increment, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { styles as s } from "../styles/ScannerScreen.styles";

let useTensorflowModel: any = null;
try {
  const tflite = require("react-native-fast-tflite");
  useTensorflowModel = tflite.useTensorflowModel;
} catch (e) {
  console.log("TFLite not available");
}

type BinData = {
  name: string;
  color: string;
  description: string;
  tip: string;
  allowed: string[];
  notAllowed: string[];
  type?: string;
};
type BinsMap = Record<string, BinData>;
type ScanMode = "camera" | "barcode";

const BIN_COLORS: Record<string, string> = {
  blue: "#2B7DE9",
  yellow: "#F2B400",
  green: "#32A852",
  brown: "#8A5A32",
  mixed: "#1F2937",
  red: "#EF4444",
  white: "#9CA3AF",
  special: "#7C3AED",
};

const CLASS_NAMES = [
  "biodegradable",
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash",
];

const CLASS_TO_BIN_TYPE: Record<string, string> = {
  biodegradable: "bio",
  cardboard: "paper",
  glass: "glass",
  metal: "packaging",
  paper: "paper",
  plastic: "packaging",
  trash: "mixed",
};

const CLASS_NAMES_SL: Record<string, string> = {
  biodegradable: "Bio odpadek",
  cardboard: "Karton",
  glass: "Steklo",
  metal: "Kovina",
  paper: "Papir",
  plastic: "Plastika",
  trash: "Mešani odpadki",
};

const mapTextToBinType = (item: string): string => {
  const lower = item.toLowerCase();
  if (lower.includes("paper") || lower.includes("papir") || lower.includes("cardboard") || lower.includes("karton")) return "paper";
  if (lower.includes("plastic") || lower.includes("plastik") || lower.includes("embalaža") || lower.includes("metal") || lower.includes("kovina") || lower.includes("pločevin")) return "packaging";
  if (lower.includes("glass") || lower.includes("steklo")) return "glass";
  if (lower.includes("food") || lower.includes("bio") || lower.includes("organic") || lower.includes("hrana")) return "bio";
  return "mixed";
};

const findBinByType = (bins: BinsMap, binType: string): { binId: string; bin: BinData } => {
  for (const [binId, bin] of Object.entries(bins)) {
    if (bin.type === binType) return { binId, bin };
  }
  const mixed = bins["mixed"] ?? Object.values(bins)[0];
  return { binId: "mixed", bin: mixed };
};

const getLariTip = async (itemName: string, binName: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Napiši SAMO en kratek praktičen nasvet v slovenščini kako pravilno pripraviti "${itemName}" pred odlaganjem v "${binName}". Odgovori SAMO z nasvetom, brez uvoda, brez razlage.`
            }],
          }],
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
};

const getScanStatsKey = (binType: string, detectedClass?: string) => {
  if (detectedClass === "glass") return "glass";
  if (detectedClass === "paper" || detectedClass === "cardboard") return "paper";
  if (detectedClass === "plastic") return "plastic";
  if (detectedClass === "biodegradable") return "bio";
  if (detectedClass === "metal") return "metal";
  if (detectedClass === "trash") return "mixed";

  if (binType === "glass") return "glass";
  if (binType === "paper") return "paper";
  if (binType === "bio") return "bio";
  if (binType === "mixed") return "mixed";

  return "other";
};

const BADGE_RULES = [
  {
    id: "firstScan",
    check: ({ totalScanCount }: any) => totalScanCount >= 1,
  },
  {
    id: "ecoHero",
    check: ({ totalPoints }: any) => totalPoints >= 1000,
  },
  {
    id: "plasticHunter",
    check: ({ scanStats }: any) => (scanStats.plastic ?? 0) >= 20,
  },
  {
    id: "paperSaver",
    check: ({ scanStats }: any) => (scanStats.paper ?? 0) >= 15,
  },
  {
    id: "glassGuardian",
    check: ({ scanStats }: any) => (scanStats.glass ?? 0) >= 10,
  },
];

const getScanStatsField = (binType: string) => {
  if (binType === "glass") return "scanStats.glass";
  if (binType === "paper") return "scanStats.paper";
  if (binType === "packaging") return "scanStats.packaging";
  if (binType === "bio") return "scanStats.bio";
  if (binType === "mixed") return "scanStats.mixed";
  return "scanStats.other";
};

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getYesterdayDateKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const saveScanToFirestore = async (
  itemName: string,
  binType: string,
  binName: string,
  municipalityId: string,
  detectedClass?: string
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return { newBadges: [] };

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return { newBadges: [] };

    const data = userSnap.data();

    const currentBadges: string[] = data.earnedBadges ?? [];
    const currentScanStats = data.scanStats ?? {};

    const scanStatsKey = getScanStatsKey(binType, detectedClass);

    const nextScanStats = {
      ...currentScanStats,
      [scanStatsKey]: (currentScanStats[scanStatsKey] ?? 0) + 1,
    };

    const nextTotalPoints = (data.totalPoints ?? 0) + 15;
    const nextScanCount = (data.scanCount ?? 0) + 1;

    const todayKey = getLocalDateKey();
    const yesterdayKey = getYesterdayDateKey();
    const lastActiveDate = data.lastActiveDate ?? "";
    const currentStreak = data.streakDays ?? 0;

    const shouldUpdateStreak = lastActiveDate !== todayKey;

    const nextStreak = shouldUpdateStreak
      ? lastActiveDate === yesterdayKey
        ? currentStreak + 1
        : 1
      : currentStreak;

    const newBadges = BADGE_RULES
      .filter((rule) => !currentBadges.includes(rule.id))
      .filter((rule) =>
        rule.check({
          totalScanCount: nextScanCount,
          totalPoints: nextTotalPoints,
          scanStats: nextScanStats,
        }),
      )
      .map((rule) => rule.id);

    await addDoc(collection(db, "scans"), {
      userId,
      itemName,
      binType,
      binName,
      municipalityId,
      pointsEarned: 15,
      scannedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "users", userId, "activities"), {
      icon: "♻️",
      iconKey: "scan",
      iconBg: "#F0FDF4",
      title: "Skeniran odpadek",
      description: `${itemName} · ${binName}`,
      points: "+15 točk",
      pointsColor: "#35A936",
      type: "scan",
      time: "Pravkar",
      createdAt: serverTimestamp(),
    });

    const userUpdateData: Record<string, any> = {
      scanCount: increment(1),
      totalPoints: increment(15),
      ekoPoints: increment(15),
      weeklyPoints: increment(15),
      monthlyPoints: increment(15),
      [`scanStats.${scanStatsKey}`]: increment(1),
      updatedAt: serverTimestamp(),
      ...(shouldUpdateStreak && {
        streakDays: nextStreak,
        lastActiveDate: todayKey,
      }),
      ...(newBadges.length > 0 && {
        earnedBadges: arrayUnion(...newBadges),
      }),
    };

    await updateDoc(userRef, userUpdateData);

    if (data.groupId) {
      try {
        await updateDoc(doc(db, "groups", data.groupId), {
          totalPoints: increment(15),
          weeklyPoints: increment(15),
          monthlyPoints: increment(15),
          scanCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      } catch (groupError) {
        console.log("Group scan points update error:", groupError);
      }
    }

    return { newBadges };
  } catch (e) {
    console.error("saveScan error:", e);
    return { newBadges: [] };
  }
};

const preprocessImage = async (imageUri: string): Promise<Float32Array | null> => {
  try {
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true, compress: 1.0 }
    );
    if (!resized.base64) return null;
    const jpegjs = require("jpeg-js");
    const binaryString = atob(resized.base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoded = jpegjs.decode(bytes, { useTArray: true });
    const float32Data = new Float32Array(224 * 224 * 3);
    let pixelIndex = 0;
    for (let i = 0; i < 224 * 224; i++) {
      const pos = i * 4;
      float32Data[pixelIndex++] = (decoded.data[pos] - 127.5) / 127.5;
      float32Data[pixelIndex++] = (decoded.data[pos + 1] - 127.5) / 127.5;
      float32Data[pixelIndex++] = (decoded.data[pos + 2] - 127.5) / 127.5;
    }
    return float32Data;
  } catch (e) {
    console.error("Preprocess error:", e);
    return null;
  }
};

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBins, setLoadingBins] = useState(true);
  const [result, setResult] = useState<{
    item: string;
    bin: BinData;
    binId: string;
    confidence?: number;
  } | null>(null);
  const [bins, setBins] = useState<BinsMap>({});
  const [municipalityId, setMunicipalityId] = useState("maribor");
  const [municipalityName, setMunicipalityName] = useState("Maribor");
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [barcodeScanning, setBarcodeScanning] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [tfliteModel, setTfliteModel] = useState<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    prepareModel();
    loadUserAndBins();
  }, []);

  const prepareModel = async () => {
    try {
      const { loadTensorflowModel } = require("react-native-fast-tflite");
      const dest = FileSystem.cacheDirectory + "recyclar_model.tflite";
      const info = await FileSystem.getInfoAsync(dest);
      if (info.exists) await FileSystem.deleteAsync(dest);
      const asset = ExpoAsset.Asset.fromModule(require("../assets/model/recyclar_model.tflite"));
      await asset.downloadAsync();
      await FileSystem.copyAsync({ from: asset.localUri!, to: dest });
      const loaded = await loadTensorflowModel({ url: dest }, []);
      setTfliteModel(loaded);
      setModelReady(true);
      console.log("🟢 TFLite model loaded!");
    } catch (e) {
      console.log("Model prep failed:", e);
      setModelReady(false);
    }
  };

  const loadUserAndBins = async () => {
    setLoadingBins(true);
    try {
      const userId = auth.currentUser?.uid;
      let munId = "maribor";
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          munId = userDoc.data().municipalityId ?? "maribor";
          setMunicipalityId(munId);
          setMunicipalityName(munId.charAt(0).toUpperCase() + munId.slice(1));
        }
      }
      const binsSnap = await getDocs(collection(db, "municipalities", munId, "bins"));
      const binsData: BinsMap = {};
      binsSnap.forEach((docSnap) => {
        binsData[docSnap.id] = docSnap.data() as BinData;
      });
      if (Object.keys(binsData).length > 0) {
        setBins(binsData);
      } else {
        setFallbackBins();
      }
    } catch (e) {
      console.error("Error loading bins:", e);
      setFallbackBins();
    } finally {
      setLoadingBins(false);
    }
  };

  const setFallbackBins = () => {
    setBins({
      blue:   { name: "Modri zabojnik",  color: "blue",   type: "paper",     description: "Zabojnik za papir.",       tip: "Papir naj bo čist in suh.",         allowed: ["Papir", "Karton"],    notAllowed: ["Masten papir"] },
      yellow: { name: "Rumeni zabojnik", color: "yellow", type: "packaging", description: "Zabojnik za embalažo.",    tip: "Stisni plastenko pred odlaganjem.", allowed: ["Plastika", "Kovine"], notAllowed: ["Umazana embalaža"] },
      green:  { name: "Zeleni zabojnik", color: "green",  type: "glass",     description: "Zabojnik za steklo.",      tip: "Izprazni steklenico.",              allowed: ["Steklo"],             notAllowed: ["Keramika"] },
      brown:  { name: "Rjavi zabojnik",  color: "brown",  type: "bio",       description: "Zabojnik za bio odpadke.", tip: "Samo organski odpadki.",            allowed: ["Hrana", "Bio"],       notAllowed: ["Plastika"] },
      mixed:  { name: "Mešani odpadki",  color: "mixed",  type: "mixed",     description: "Za kar ne gre drugam.",    tip: "Sem gre kar se ne da razvrstiti.",  allowed: ["Mešani"],             notAllowed: [] },
    });
  };

  const runTFLiteModel = async (imageUri: string) => {
    if (!tfliteModel) return null;
    try {
      const inputData = await preprocessImage(imageUri);
      if (!inputData) return null;
      const output = await tfliteModel.run([inputData.buffer]);
      if (!output?.[0]) return null;
      const predictions = new Float32Array(output[0]);
      let maxIndex = 0;
      let maxValue = predictions[0];
      for (let i = 1; i < predictions.length; i++) {
        if (predictions[i] > maxValue) {
          maxValue = predictions[i];
          maxIndex = i;
        }
      }
      const className = CLASS_NAMES[maxIndex] ?? "trash";
      const confidence = Math.round(maxValue * 100);
      return { className, confidence };
    } catch (e) {
      console.error("TFLite error:", e);
      return null;
    }
  };

  const showResult = async (tfliteClass?: string, confidence?: number, fallbackText?: string) => {
    const binType = tfliteClass ? CLASS_TO_BIN_TYPE[tfliteClass] ?? "mixed" : mapTextToBinType(fallbackText ?? "");
    const { binId, bin } = findBinByType(bins, binType);
    const displayName = tfliteClass ? CLASS_NAMES_SL[tfliteClass] ?? fallbackText ?? "Odpadek" : fallbackText ?? "Odpadek";
    setResult({ item: displayName, bin, binId, confidence });
    const tip = await getLariTip(displayName, bin.name);
    if (tip) setResult({ item: displayName, bin: { ...bin, tip }, binId, confidence });
    const { newBadges } = await saveScanToFirestore(
      displayName,
      binType,
      bin.name,
      municipalityId,
      tfliteClass,
    );
    if (newBadges.length > 0) {
      Alert.alert("Nova značka!", `Odklenil si: ${newBadges.join(", ")}`, [{ text: "Super!" }]);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setResult(null);
    try {
      const pic = await cameraRef.current.takePictureAsync({ base64: false, quality: 0.8 });
      setPhoto(pic.uri);
      if (modelReady && tfliteModel) {
        const tfliteResult = await runTFLiteModel(pic.uri);
        if (tfliteResult && tfliteResult.confidence >= 40) {
          await showResult(tfliteResult.className, tfliteResult.confidence);
          setLoading(false);
          return;
        }
      }
      setLoading(false);
      Alert.alert(
        "Odpadek posnet!",
        modelReady ? "Model ni bil prepričan. Poskusi s črtno kodo za boljši rezultat." : "Poskusi s črtno kodo za identifikacijo.",
        [
          { text: "Črtna koda", onPress: () => { setPhoto(null); setScanMode("barcode"); setBarcodeScanning(true); } },
          { text: "Prekliči", onPress: () => setPhoto(null), style: "cancel" },
        ]
      );
    } catch {
      setLoading(false);
      Alert.alert("Napaka", "Fotografiranje ni uspelo.");
    }
  };

  const getBinTypeFromGemini = async (itemName: string, packaging: string): Promise<string> => {
    try {
      const prompt = `Produkt: "${itemName}", Embalaža: "${packaging}". Kateri zabojnik po slovenskih pravilih? SAMO ena beseda: packaging, paper, glass, bio, ali mixed.`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (!res.ok) return "packaging";
      const data = await res.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() ?? "packaging";
      if (answer.includes("paper")) return "paper";
      if (answer.includes("glass")) return "glass";
      if (answer.includes("bio")) return "bio";
      if (answer.includes("mixed")) return "mixed";
      return "packaging";
    } catch {
      return "packaging";
    }
  };

  const handleBarcodeScan = async ({ data: barcode }: { data: string }) => {
    if (!barcodeScanning) return;
    setBarcodeScanning(false);
    setLoading(true);
    setScanMode("camera");
    try {
      let itemName = barcode;
      let packaging = "";
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        if (data.status === 1 && data.product) {
          itemName = data.product.product_name || barcode;
          packaging = data.product.packaging || "";
        }
      } catch {}
      const binType = await getBinTypeFromGemini(itemName, packaging);
      const { binId, bin } = findBinByType(bins, binType);
      const displayName = itemName === barcode ? `Produkt (${barcode})` : itemName;
      setResult({ item: displayName, bin, binId });
      const tip = await getLariTip(displayName, bin.name);
      if (tip) setResult({ item: displayName, bin: { ...bin, tip }, binId });
    } catch (e) {
      console.log("Barcode error:", e);
      Alert.alert("Napaka", "Skeniranje ni uspelo.");
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setPhoto(null);
    setResult(null);
    setScanMode("camera");
    setBarcodeScanning(false);
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.permText}>Potrebujemo dostop do kamere za skeniranje odpadkov.</Text>
        <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
          <Text style={s.permBtnText}>Dovoli dostop do kamere</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (scanMode === "barcode") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.cameraBox}>
          <CameraView
            style={s.camera}
            facing="back"
            onBarcodeScanned={barcodeScanning ? handleBarcodeScan : undefined}
          />
        </View>

        <View style={s.statusRow}>
          <Text style={s.statusDot}>📷</Text>
          <Text style={s.statusText}>Usmeri na črtno kodo</Text>
        </View>

        {loading && (
          <View style={s.loadingOverlay}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={s.loadingText}>Iščem produkt...</Text>
          </View>
        )}

        {result && !loading && (
          <ScrollView style={s.resultsScroll} contentContainerStyle={s.resultsContent}>
            <View style={s.dragHandle} />
            <View style={s.resultCard}>
              <Text style={s.resultLabel}>Prepoznano:</Text>
              <View style={s.resultItemRow}>
                <Text style={s.resultItem}>{result.item}</Text>
              </View>
              <Text style={s.resultLabel}>Odloži v:</Text>
              <Text style={[s.resultBin, { color: BIN_COLORS[result.binId] ?? "#1F2937" }]}>
                ● {result.bin.name}
              </Text>
              <Text style={s.resultDesc}>{result.bin.description}</Text>
              <Text style={s.municipalityBadge}>📍 {municipalityName}</Text>
            </View>
            <View style={s.rulesCard}>
              <View style={s.rulesCol}>
                <Text style={s.rulesTitle}>✅ Dovoljeno</Text>
                {(result.bin.allowed ?? []).slice(0, 5).map((item, i) => (
                  <Text key={i} style={s.rulesItem}>• {item}</Text>
                ))}
              </View>
              <View style={s.rulesDivider} />
              <View style={s.rulesCol}>
                <Text style={s.rulesTitleRed}>❌ Ni dovoljeno</Text>
                {(result.bin.notAllowed ?? []).slice(0, 5).map((item, i) => (
                  <Text key={i} style={s.rulesItem}>• {item}</Text>
                ))}
              </View>
            </View>
            <View style={s.tipCard}>
              <View style={s.tipHeader}>
                <Text style={s.tipTitle}>Lari nasvet ✦</Text>
              </View>
              <Text style={s.tipText}>{result.bin.tip}</Text>
            </View>
          </ScrollView>
        )}

        <View style={s.buttonsRow}>
          {!result ? (
            <TouchableOpacity style={s.mainBtn} onPress={() => setScanMode("camera")}>
              <Text style={s.mainBtnText}>← Nazaj na kamero</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.mainBtn} onPress={resetScan}>
              <Text style={s.mainBtnText}>Skeniraj znova</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <DecorativeBackground variant="scanner" />

      <View style={s.statusRow}>
        {loadingBins ? (
          <>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={s.statusText}>Nalagam pravila za {municipalityName}...</Text>
          </>
        ) : (
          <>
            <Text style={s.statusDot}>{modelReady ? "🟢" : "🟡"}</Text>
            <Text style={s.statusText}>
              {modelReady ? `Model aktiven · ${municipalityName}` : `Nalagam model · ${municipalityName}`}
            </Text>
          </>
        )}
      </View>

      <View style={s.cameraBox}>
        {!photo ? (
          <CameraView ref={cameraRef} style={s.camera} facing="back" />
        ) : (
          <>
            <Image source={{ uri: photo }} style={s.photo} />
            {loading && (
              <View style={s.loadingOverlay}>
                <ActivityIndicator size="large" color="#22C55E" />
                <Text style={s.loadingText}>
                  {modelReady ? "AI analizira odpadek..." : "Analiziram..."}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {result && !loading && (
        <ScrollView style={s.resultsScroll} contentContainerStyle={s.resultsContent}>
          <View style={s.dragHandle} />
          <View style={s.resultCard}>
            <Text style={s.resultLabel}>Prepoznano:</Text>
            <View style={s.resultItemRow}>
              <Text style={s.resultItem}>{result.item}</Text>
              {result.confidence && (
                <View style={s.confidenceBadge}>
                  <Text style={s.confidenceText}>{result.confidence}%</Text>
                </View>
              )}
            </View>
            <Text style={s.resultLabel}>Odloži v:</Text>
            <Text style={[s.resultBin, { color: BIN_COLORS[result.binId] ?? "#1F2937" }]}>
              ● {result.bin.name}
            </Text>
            <Text style={s.resultDesc}>{result.bin.description}</Text>
            <Text style={s.municipalityBadge}>📍 {municipalityName}</Text>
          </View>
          <View style={s.rulesCard}>
            <View style={s.rulesCol}>
              <Text style={s.rulesTitle}>✅ Dovoljeno</Text>
              {(result.bin.allowed ?? []).slice(0, 5).map((item, i) => (
                <Text key={i} style={s.rulesItem}>• {item}</Text>
              ))}
            </View>
            <View style={s.rulesDivider} />
            <View style={s.rulesCol}>
              <Text style={s.rulesTitleRed}>❌ Ni dovoljeno</Text>
              {(result.bin.notAllowed ?? []).slice(0, 5).map((item, i) => (
                <Text key={i} style={s.rulesItem}>• {item}</Text>
              ))}
            </View>
          </View>

          <View style={s.tipRow}>
            <Image
              source={require("../assets/Lari2.png")}
              style={s.tipLari}
              resizeMode="contain"
            />
            <View style={s.tipCard}>
              <Text style={s.tipTitle}>Lari nasvet</Text>
              <Text style={s.tipText}>{result.bin.tip}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      <View style={s.buttonsRow}>
        {!result ? (
          <>
            <TouchableOpacity
              style={[s.mainBtn, loadingBins && s.btnDisabled]}
              onPress={takePicture}
              disabled={loadingBins}
            >
              <Text style={s.mainBtnText}>Slikaj</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.secondBtn, loadingBins && s.btnDisabled]}
              onPress={() => { setScanMode("barcode"); setBarcodeScanning(true); }}
              disabled={loadingBins}
            >
              <Text style={s.secondBtnText}>Črtna koda</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={s.mainBtn} onPress={resetScan}>
            <Text style={s.mainBtnText}>Skeniraj znova</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}