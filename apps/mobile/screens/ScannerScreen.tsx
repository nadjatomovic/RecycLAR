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
import BottomNavBar from "../components/BottomNavBar";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import * as ExpoAsset from "expo-asset";
import * as ImageManipulator from "expo-image-manipulator";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { styles as s } from "../styles/ScannerScreen.styles";

// ─── TFLite safe import ──────────────────────────────────────────────────────
let useTensorflowModel: any = null;

try {
  const tflite = require("react-native-fast-tflite");
  useTensorflowModel = tflite.useTensorflowModel;
} catch (e) {
  console.log("TFLite not available");
}

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Bin colors ──────────────────────────────────────────────────────────────
const BIN_COLORS: Record<string, string> = {
  blue: "#2B7DE9",
  yellow: "#F2B400",
  green: "#32A852",
  brown: "#8A5A32",
  mixed: "#1F2937",
  black: "#1F2937",
  gray: "#6B7280",
  red: "#EF4444",
  white: "#9CA3AF",
  special: "#7C3AED",
};

// ─── TFLite class names ──────────────────────────────────────────────────────
const CLASS_NAMES = [
  "biodegradable",
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash",
];

// ─── TFLite class → bin type ─────────────────────────────────────────────────
const CLASS_TO_BIN_TYPE: Record<string, string> = {
  biodegradable: "bio",
  cardboard: "paper",
  glass: "glass",
  metal: "packaging",
  paper: "paper",
  plastic: "packaging",
  trash: "mixed",
};

// ─── Slovenian display names ─────────────────────────────────────────────────
const CLASS_NAMES_SL: Record<string, string> = {
  biodegradable: "Bio odpadek",
  cardboard: "Karton",
  glass: "Steklo",
  metal: "Kovina",
  paper: "Papir",
  plastic: "Plastika",
  trash: "Mešani odpadki",
};

// ─── Fallback: map item text → bin type ──────────────────────────────────────
const mapTextToBinType = (item: string): string => {
  const lower = item.toLowerCase();

  if (
    lower.includes("paper") ||
    lower.includes("papir") ||
    lower.includes("cardboard") ||
    lower.includes("karton")
  ) {
    return "paper";
  }

  if (
    lower.includes("plastic") ||
    lower.includes("plastik") ||
    lower.includes("embalaža") ||
    lower.includes("metal") ||
    lower.includes("kovina") ||
    lower.includes("pločevin")
  ) {
    return "packaging";
  }

  if (lower.includes("glass") || lower.includes("steklo")) {
    return "glass";
  }

  if (
    lower.includes("food") ||
    lower.includes("bio") ||
    lower.includes("organic") ||
    lower.includes("hrana")
  ) {
    return "bio";
  }

  return "mixed";
};

// ─── Find bin by type ────────────────────────────────────────────────────────
const findBinByType = (
  bins: BinsMap,
  binType: string
): { binId: string; bin: BinData } => {
  for (const [binId, bin] of Object.entries(bins)) {
    if (bin.type === binType) {
      return { binId, bin };
    }
  }

  const fallbackBin = bins["mixed"] ?? Object.values(bins)[0];

  return {
    binId: "mixed",
    bin: fallbackBin,
  };
};

// ─── Gemini Lari tip ─────────────────────────────────────────────────────────
const getLariTip = async (
  itemName: string,
  binName: string
): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Napiši SAMO en kratek praktičen nasvet v slovenščini kako pravilno pripraviti "${itemName}" pred odlaganjem v "${binName}". Odgovori SAMO z nasvetom, brez uvoda, brez razlage.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
};

// ─── Gemini barcode/product → bin type ───────────────────────────────────────
const getBinTypeFromGemini = async (
  itemName: string,
  packaging: string,
  categories: string
): Promise<string> => {
  try {
    const isBarcode = /^\d+$/.test(itemName);

    const prompt = isBarcode
      ? `Barcode številka: ${itemName}. To je verjetno plastična ali kovinska embalaža živilskega produkta. Kateri zabojnik? Odgovori SAMO z eno besedo: packaging, paper, glass, bio, ali mixed.`
      : `Produkt: "${itemName}", Embalaža: "${packaging}", Kategorije: "${categories}". Kateri zabojnik po slovenskih pravilih? SAMO ena beseda: packaging, paper, glass, bio, ali mixed.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      return "packaging";
    }

    const data = await res.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.trim()
        .toLowerCase() ?? "packaging";

    if (answer.includes("paper")) return "paper";
    if (answer.includes("glass")) return "glass";
    if (answer.includes("bio")) return "bio";
    if (answer.includes("mixed")) return "mixed";

    return "packaging";
  } catch {
    return "packaging";
  }
};

// ─── Preprocess image for MobileNetV2 224x224 ────────────────────────────────
const preprocessImage = async (
  imageUri: string
): Promise<Float32Array | null> => {
  try {
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      {
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
        compress: 1.0,
      }
    );

    if (!resized.base64) {
      return null;
    }

    const binaryString = atob(resized.base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let dataStart = 0;

    for (let i = 0; i < bytes.length - 1; i++) {
      if (bytes[i] === 0xff && bytes[i + 1] === 0xda) {
        dataStart = i + 12;
        break;
      }
    }

    const float32Data = new Float32Array(224 * 224 * 3);
    let pixelIndex = 0;

    for (let i = 0; i < 224 * 224; i++) {
      const pos = dataStart + i * 3;

      if (pos + 2 < bytes.length) {
        float32Data[pixelIndex++] = (bytes[pos] - 127.5) / 127.5;
        float32Data[pixelIndex++] = (bytes[pos + 1] - 127.5) / 127.5;
        float32Data[pixelIndex++] = (bytes[pos + 2] - 127.5) / 127.5;
      }
    }

    return float32Data;
  } catch (e) {
    console.error("Preprocess error:", e);
    return null;
  }
};

// ─── Component ───────────────────────────────────────────────────────────────
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

  // ─── Prepare TFLite model ──────────────────────────────────────────────────
  const prepareModel = async () => {
    try {
      const { loadTensorflowModel } = require("react-native-fast-tflite");
      const dest = FileSystem.cacheDirectory + "recyclar_model.tflite";

      const info = await FileSystem.getInfoAsync(dest);

      if (info.exists) {
        await FileSystem.deleteAsync(dest);
      }

      const asset = ExpoAsset.Asset.fromModule(
        require("../assets/model/recyclar_model.tflite")
      );

      await asset.downloadAsync();

      await FileSystem.copyAsync({
        from: asset.localUri!,
        to: dest,
      });

      const loaded = await loadTensorflowModel({ url: dest }, []);

      setTfliteModel(loaded);
      setModelReady(true);

      console.log("✅ TFLite model loaded!");
    } catch (e) {
      console.log("Model prep failed:", e);
      setModelReady(false);
    }
  };

  // ─── Load user municipality + bins ─────────────────────────────────────────
  const loadUserAndBins = async () => {
    setLoadingBins(true);

    try {
      const userId = auth.currentUser?.uid;
      let munId = "maribor";

      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          munId = userDoc.data().municipalityId ?? "maribor";
        }
      }

      setMunicipalityId(munId);
      setMunicipalityName(munId.charAt(0).toUpperCase() + munId.slice(1));

      const binsSnap = await getDocs(
        collection(db, "municipalities", munId, "bins")
      );

      const binsData: BinsMap = {};

      binsSnap.forEach((docSnap) => {
        binsData[docSnap.id] = docSnap.data() as BinData;
      });

      if (Object.keys(binsData).length > 0) {
        setBins(binsData);
        console.log(`✅ Loaded ${Object.keys(binsData).length} bins for ${munId}`);
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
      blue: {
        name: "Modri zabojnik",
        color: "blue",
        type: "paper",
        description: "Zabojnik za papir.",
        tip: "Papir naj bo čist in suh.",
        allowed: ["Papir", "Karton"],
        notAllowed: ["Masten papir"],
      },
      yellow: {
        name: "Rumeni zabojnik",
        color: "yellow",
        type: "packaging",
        description: "Zabojnik za embalažo.",
        tip: "Stisni plastenko pred odlaganjem.",
        allowed: ["Plastika", "Kovine"],
        notAllowed: ["Umazana embalaža"],
      },
      green: {
        name: "Zeleni zabojnik",
        color: "green",
        type: "glass",
        description: "Zabojnik za steklo.",
        tip: "Izprazni steklenico.",
        allowed: ["Steklo"],
        notAllowed: ["Keramika"],
      },
      brown: {
        name: "Rjavi zabojnik",
        color: "brown",
        type: "bio",
        description: "Zabojnik za bio odpadke.",
        tip: "Samo organski odpadki.",
        allowed: ["Hrana", "Bio"],
        notAllowed: ["Plastika"],
      },
      mixed: {
        name: "Mešani odpadki",
        color: "mixed",
        type: "mixed",
        description: "Za odpadke, ki ne spadajo drugam.",
        tip: "Sem gre samo tisto, česar ne moreš razvrstiti drugam.",
        allowed: ["Mešani odpadki"],
        notAllowed: [],
      },
    });
  };

  // ─── Run TFLite model ──────────────────────────────────────────────────────
  const runTFLiteModel = async (imageUri: string) => {
    if (!tfliteModel) {
      return null;
    }

    try {
      const inputData = await preprocessImage(imageUri);

      if (!inputData) {
        return null;
      }

      const output = await tfliteModel.run([inputData.buffer]);

      if (!output?.[0]) {
        return null;
      }

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

      console.log(`TFLite: ${className} (${confidence}%)`);

      return {
        className,
        confidence,
      };
    } catch (e) {
      console.error("TFLite error:", e);
      return null;
    }
  };

  // ─── Show result ───────────────────────────────────────────────────────────
  const showResult = async (
    tfliteClass?: string,
    confidence?: number,
    fallbackText?: string
  ) => {
    const binType = tfliteClass
      ? CLASS_TO_BIN_TYPE[tfliteClass] ?? "mixed"
      : mapTextToBinType(fallbackText ?? "");

    const { binId, bin } = findBinByType(bins, binType);

    const displayName = tfliteClass
      ? CLASS_NAMES_SL[tfliteClass] ?? fallbackText ?? "Odpadek"
      : fallbackText ?? "Odpadek";

    setResult({
      item: displayName,
      bin,
      binId,
      confidence,
    });

    const tip = await getLariTip(displayName, bin.name);

    if (tip) {
      setResult({
        item: displayName,
        bin: {
          ...bin,
          tip,
        },
        binId,
        confidence,
      });
    }
  };

  // ─── Take picture ──────────────────────────────────────────────────────────
  const takePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const pic = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.8,
      });

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
        "Odpadek posnet! 📷",
        modelReady
          ? "Model ni bil prepričan. Poskusi s črtno kodo za boljši rezultat."
          : "Poskusi s črtno kodo za identifikacijo.",
        [
          {
            text: "🔲 Črtna koda",
            onPress: () => {
              setPhoto(null);
              setScanMode("barcode");
              setBarcodeScanning(true);
            },
          },
          {
            text: "Prekliči",
            onPress: () => setPhoto(null),
            style: "cancel",
          },
        ]
      );
    } catch {
      setLoading(false);
      Alert.alert("Napaka", "Fotografiranje ni uspelo.");
    }
  };

  // ─── Barcode scan ──────────────────────────────────────────────────────────
  const handleBarcodeScan = async ({ data: barcode }: { data: string }) => {
    if (!barcodeScanning) {
      return;
    }

    setBarcodeScanning(false);
    setLoading(true);
    setScanMode("camera");

    try {
      const binType = await getBinTypeFromGemini(barcode, "", "");
      const { binId, bin } = findBinByType(bins, binType);
      const displayName = `Produkt ${barcode}`;

      setResult({
        item: displayName,
        bin,
        binId,
      });

      const tip = await getLariTip(displayName, bin.name);

      if (tip) {
        setResult({
          item: displayName,
          bin: {
            ...bin,
            tip,
          },
          binId,
        });
      }
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

  // ─── Permissions ───────────────────────────────────────────────────────────
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.permText}>
          Potrebujemo dostop do kamere za skeniranje odpadkov.
        </Text>

        <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
          <Text style={s.permBtnText}>Dovoli dostop do kamere</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── Barcode mode ──────────────────────────────────────────────────────────
  if (scanMode === "barcode") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => setScanMode("camera")}
            style={s.backBtn}
            activeOpacity={0.8}
          >
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={s.headerTitle}>
            <Text style={s.headerGreen}>Skeniraj</Text>
            <Text style={s.headerPurple}> črtno kodo</Text>
          </Text>

          <View style={{ width: 44 }} />
        </View>

        <View style={s.titleRow}>
          <Text style={s.title}>Črtna koda</Text>
          <Text style={s.subtitle}>
            Usmeri kamero na črtno kodo izdelka.
          </Text>
        </View>

        <View style={s.cameraBox}>
          <CameraView
            style={s.camera}
            facing="back"
            onBarcodeScanned={barcodeScanning ? handleBarcodeScan : undefined}
          />

          <View style={s.cornerTL} />
          <View style={s.cornerTR} />
          <View style={s.cornerBL} />
          <View style={s.cornerBR} />

          <View style={s.goodLight}>
            <Text style={s.goodLightText}>🔲 Usmeri na črtno kodo</Text>
          </View>
        </View>

        {loading && (
          <View style={s.centerLoader}>
            <ActivityIndicator size="large" color="#34A936" />
            <Text style={s.loadingBinsText}>Iščem produkt...</Text>
          </View>
        )}

        <View style={s.buttonsRow}>
          <TouchableOpacity
            style={s.mainBtn}
            onPress={() => setScanMode("camera")}
            activeOpacity={0.9}
          >
            <Text style={s.mainBtnText}>← Nazaj na kamero</Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Scanner" />
      </SafeAreaView>
    );
  }

  // ─── Main camera mode ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View style={{ width: 44 }} />

        <Text style={s.headerTitle}>
          <Text style={s.headerGreen}>Recyc</Text>
          <Text style={s.headerPurple}>LAR</Text>
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <View style={s.titleRow}>
        <Text style={s.title}>Skener ✦</Text>
        <Text style={s.subtitle}>
          Slikaj odpadek ali skeniraj črtno kodo.
        </Text>

        <View style={s.statusRow}>
          {loadingBins ? (
            <>
              <ActivityIndicator size="small" color="#34A936" />
              <Text style={s.statusText}>
                Nalagam pravila za {municipalityName}...
              </Text>
            </>
          ) : (
            <>
              <Text style={s.statusDot}>{modelReady ? "🟢" : "🟡"}</Text>
              <Text style={s.statusText}>
                {modelReady
                  ? `AI model aktiven · ${municipalityName}`
                  : `Nalagam AI model · ${municipalityName}`}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={s.cameraBox}>
        {!photo ? (
          <>
            <CameraView ref={cameraRef} style={s.camera} facing="back" />

            <View style={s.cornerTL} />
            <View style={s.cornerTR} />
            <View style={s.cornerBL} />
            <View style={s.cornerBR} />

            <View style={s.goodLight}>
              <Text style={s.goodLightText}>🌿 Dobro osvetljeno</Text>
            </View>
          </>
        ) : (
          <>
            <Image source={{ uri: photo }} style={s.photo} />

            {loading && (
              <View style={s.loadingOverlay}>
                <ActivityIndicator size="large" color="#34A936" />
                <Text style={s.loadingText}>
                  {modelReady ? "AI analizira odpadek..." : "Analiziram..."}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <ScrollView
        style={s.resultsScroll}
        contentContainerStyle={s.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {result && !loading && (
          <View style={s.resultCard}>
            <Text style={s.resultLabel}>Prepoznano:</Text>

            <View style={s.resultItemRow}>
              <Text style={s.resultItem}>{result.item} 🌿</Text>

              {result.confidence && (
                <View style={s.confidenceBadge}>
                  <Text style={s.confidenceText}>
                    {result.confidence}%
                  </Text>
                </View>
              )}
            </View>

            <Text style={s.resultLabel}>Odloži v:</Text>

            <Text
              style={[
                s.resultBin,
                {
                  color:
                    BIN_COLORS[result.bin.color] ??
                    BIN_COLORS[result.binId] ??
                    "#1F2937",
                },
              ]}
            >
              ● {result.bin.name}
            </Text>

            <Text style={s.resultDesc}>{result.bin.description}</Text>

            <Text style={s.municipalityBadge}>📍 {municipalityName}</Text>
          </View>
        )}

        {result && !loading && (
          <View style={s.rulesCard}>
            <View style={s.rulesCol}>
              <Text style={s.rulesTitle}>✅ Dovoljeno</Text>

              {(result.bin.allowed ?? []).slice(0, 5).map((item, index) => (
                <Text key={index} style={s.rulesItem}>
                  • {item}
                </Text>
              ))}
            </View>

            <View style={s.rulesDivider} />

            <View style={s.rulesCol}>
              <Text style={s.rulesTitleRed}>❌ Ni dovoljeno</Text>

              {(result.bin.notAllowed ?? []).slice(0, 5).map((item, index) => (
                <Text key={index} style={s.rulesItem}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        )}

        {result && !loading && (
          <View style={s.tipCard}>
            <View style={s.tipHeader}>
              <Text style={s.tipTitle}>Lari nasvet ✦</Text>
            </View>

            <Text style={s.tipText}>{result.bin.tip}</Text>
          </View>
        )}
      </ScrollView>

      <View style={s.buttonsRow}>
        {!result ? (
          <>
            <TouchableOpacity
              style={[s.mainBtn, loadingBins && s.btnDisabled]}
              onPress={takePicture}
              disabled={loadingBins}
              activeOpacity={0.9}
            >
              <Text style={s.mainBtnText}>📷 Slikaj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.secondBtn, loadingBins && s.btnDisabled]}
              onPress={() => {
                setScanMode("barcode");
                setBarcodeScanning(true);
              }}
              disabled={loadingBins}
              activeOpacity={0.9}
            >
              <Text style={s.secondBtnText}>🔲 Črtna koda</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={s.mainBtn}
            onPress={resetScan}
            activeOpacity={0.9}
          >
            <Text style={s.mainBtnText}>🔄 Skeniraj znova</Text>
          </TouchableOpacity>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute="Scanner" />
    </SafeAreaView>
  );
}