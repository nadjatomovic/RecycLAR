import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { styles as s } from "../styles/ScannerScreen.styles";

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
type ScanMode = "camera" | "barcode" | "manual";

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

const mapItemToBin = (item: string): string => {
  const lower = item.toLowerCase();

  if (
    lower.includes("paper") ||
    lower.includes("papir") ||
    lower.includes("cardboard") ||
    lower.includes("karton") ||
    lower.includes("newspaper") ||
    lower.includes("časopis")
  ) {
    return "blue";
  }

  if (
    lower.includes("plastic") ||
    lower.includes("plastik") ||
    lower.includes("bottle") ||
    lower.includes("can") ||
    lower.includes("metal") ||
    lower.includes("embalaža") ||
    lower.includes("packaging") ||
    lower.includes("pločevin")
  ) {
    return "yellow";
  }

  if (
    lower.includes("glass") ||
    lower.includes("steklo") ||
    lower.includes("steklenica")
  ) {
    return "green";
  }

  if (
    lower.includes("food") ||
    lower.includes("bio") ||
    lower.includes("organic") ||
    lower.includes("fruit") ||
    lower.includes("vegetable") ||
    lower.includes("hrana") ||
    lower.includes("banana")
  ) {
    return "brown";
  }

  return "mixed";
};

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
                  text: `Napiši SAMO en praktičen nasvet v slovenščini kako pravilno pripraviti "${itemName}" pred odlaganjem v "${binName}". Na primer: "Stisni plastenko in odstrani pokrovček." ali "Izperi kozarec pred odlaganjem." Odgovori SAMO z nasvetom, brez uvoda, brez razlage, brez vprašanj.`,
                },
              ],
            },
          ],
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

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBins, setLoadingBins] = useState(true);
  const [result, setResult] = useState<{
    item: string;
    bin: BinData;
    binId: string;
  } | null>(null);

  const [bins, setBins] = useState<BinsMap>({});
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [manualInput, setManualInput] = useState("");
  const [barcodeScanning, setBarcodeScanning] = useState(false);

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    loadBinsFromFirebase();
  }, []);

  const loadBinsFromFirebase = async () => {
    setLoadingBins(true);

    try {
      const binsSnap = await getDocs(
        collection(db, "municipalities", "maribor", "bins")
      );

      const binsData: BinsMap = {};

      binsSnap.forEach((docSnap) => {
        binsData[docSnap.id] = docSnap.data() as BinData;
      });

      if (Object.keys(binsData).length > 0) {
        setBins(binsData);
      } else {
        setFallbackBins();
      }
    } catch (err) {
      console.log("Firebase bins load failed, using fallback:", err);
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
        description: "Zabojnik za papir.",
        tip: "Papir naj bo čist in suh.",
        allowed: ["Čist papir", "Karton"],
        notAllowed: ["Masten papir"],
      },
      yellow: {
        name: "Rumeni zabojnik",
        color: "yellow",
        description: "Zabojnik za embalažo.",
        tip: "Stisni plastenko pred odlaganjem.",
        allowed: ["Plastika", "Kovine"],
        notAllowed: ["Umazana embalaža"],
      },
      green: {
        name: "Zeleni zabojnik",
        color: "green",
        description: "Zabojnik za steklo.",
        tip: "Izprazni steklenico pred odlaganjem.",
        allowed: ["Steklo"],
        notAllowed: ["Keramika"],
      },
      brown: {
        name: "Rjavi zabojnik",
        color: "brown",
        description: "Zabojnik za bio odpadke.",
        tip: "Samo organski odpadki.",
        allowed: ["Hrana", "Bio"],
        notAllowed: ["Plastične vrečke"],
      },
      mixed: {
        name: "Mešani odpadki",
        color: "mixed",
        description: "Za kar ne gre drugam.",
        tip: "Sem gre kar se ne da razvrstiti.",
        allowed: ["Mešani odpadki"],
        notAllowed: [],
      },
    });
  };

  const showResult = async (itemName: string) => {
    const binId = mapItemToBin(itemName);
    const bin = bins[binId] ?? bins["mixed"] ?? Object.values(bins)[0];

    if (!bin) {
      Alert.alert("Napaka", "Pravila za zabojnike niso naložena.");
      return;
    }

    setResult({
      item: itemName,
      bin,
      binId,
    });

    const geminiTip = await getLariTip(itemName, bin.name);

    if (geminiTip) {
      setResult({
        item: itemName,
        bin: {
          ...bin,
          tip: geminiTip,
        },
        binId,
      });
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || loadingBins) return;

    setLoading(true);
    setResult(null);

    try {
      const pic = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.75,
      });

      setPhoto(pic.uri);

      Alert.alert(
        "Odpadek posnet! 📷",
        "Kako želiš identificirati odpadek?",
        [
          {
            text: "Skeniraj črtno kodo",
            onPress: () => {
              setPhoto(null);
              setScanMode("barcode");
              setBarcodeScanning(true);
            },
          },
          {
            text: "Vnesi ročno",
            onPress: () => {
              setScanMode("manual");
            },
          },
          {
            text: "Prekliči",
            onPress: () => setPhoto(null),
            style: "cancel",
          },
        ]
      );
    } catch (err) {
      console.log("Take picture error:", err);
      Alert.alert("Napaka", "Fotografiranje ni uspelo.");
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: false,
        quality: 0.7,
      });

      if (!picked.canceled && picked.assets[0]) {
        setPhoto(picked.assets[0].uri);

        Alert.alert(
          "Slika izbrana! 🖼",
          "Kako želiš identificirati odpadek?",
          [
            {
              text: "Skeniraj črtno kodo",
              onPress: () => {
                setPhoto(null);
                setScanMode("barcode");
                setBarcodeScanning(true);
              },
            },
            {
              text: "Vnesi ročno",
              onPress: () => setScanMode("manual"),
            },
            {
              text: "Prekliči",
              onPress: () => setPhoto(null),
              style: "cancel",
            },
          ]
        );
      }
    } catch (err) {
      console.log("Gallery error:", err);
      Alert.alert("Napaka", "Izbira slike ni uspela.");
    }
  };

  const handleBarcodeScan = async ({ data: barcode }: { data: string }) => {
    if (!barcodeScanning) return;

    setBarcodeScanning(false);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      const data = await res.json();

      setLoading(false);
      setScanMode("camera");

      if (data.status === 1 && data.product) {
        const product = data.product;
        const itemName =
          product.product_name_sl ||
          product.product_name ||
          product.generic_name ||
          barcode;

        const packaging =
          product.packaging ||
          product.packaging_text ||
          product.categories ||
          "";

        const searchText = `${itemName} ${packaging}`;
        await showResult(searchText);
      } else {
        Alert.alert(
          "Produkt ni najden",
          "Ta produkt ni v bazi. Poskusi ročni vnos.",
          [
            {
              text: "Vnesi ročno",
              onPress: () => setScanMode("manual"),
            },
            {
              text: "Prekliči",
              style: "cancel",
            },
          ]
        );
      }
    } catch (err) {
      console.log("Barcode error:", err);
      setLoading(false);
      setScanMode("camera");
      Alert.alert("Napaka", "Ni se uspelo povezati z bazo produktov.");
    }
  };

  const handleManualSearch = async () => {
    const value = manualInput.trim();

    if (!value) return;

    setLoading(true);
    setScanMode("camera");
    setManualInput("");

    await showResult(value);

    setLoading(false);
  };

  const resetScan = () => {
    setPhoto(null);
    setResult(null);
    setScanMode("camera");
    setManualInput("");
    setBarcodeScanning(false);
  };

  if (!permission) return <View />;

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

  if (scanMode === "barcode") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => setScanMode("camera")}
            style={s.backBtn}
          >
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={s.headerTitle}>
            <Text style={s.headerGreen}>Skeniraj</Text>
            <Text style={s.headerPurple}> črtno kodo</Text>
          </Text>

          <View style={{ width: 40 }} />
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
            <Text style={s.goodLightText}>Usmeri na črtno kodo</Text>
          </View>
        </View>

        {loading && (
          <View style={s.centerLoader}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={s.loadingBinsText}>Iščem produkt...</Text>
          </View>
        )}

        <View style={s.buttonsRow}>
          <TouchableOpacity
            style={s.secondBtn}
            onPress={() => setScanMode("manual")}
          >
            <Text style={s.secondBtnText}>Vnesi ročno</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.mainBtn}
            onPress={() => setScanMode("camera")}
          >
            <Text style={s.mainBtnText}>Nazaj</Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Scanner" />
      </SafeAreaView>
    );
  }

  if (scanMode === "manual") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => setScanMode("camera")}
            style={s.backBtn}
          >
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={s.headerTitle}>
            <Text style={s.headerGreen}>Recyc</Text>
            <Text style={s.headerPurple}>LAR</Text>
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={s.manualContainer}>
          <Text style={s.title}>Ročni vnos ✦</Text>
          <Text style={s.subtitle}>Vpiši ime odpadka ali produkta.</Text>

          <TextInput
            style={s.manualInput}
            placeholder="npr. plastenka, karton, steklenica..."
            placeholderTextColor="#A0A0AA"
            value={manualInput}
            onChangeText={setManualInput}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleManualSearch}
          />

          <TouchableOpacity
            style={[s.mainBtn, !manualInput.trim() && { opacity: 0.4 }]}
            onPress={handleManualSearch}
            disabled={!manualInput.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.mainBtnText}>Poišči</Text>
            )}
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Scanner" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View style={{ width: 40 }} />

        <Text style={s.headerTitle}>
          <Text style={s.headerGreen}>Recyc</Text>
          <Text style={s.headerPurple}>LAR</Text>
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={s.titleRow}>
        <Text style={s.title}>Skener ✦</Text>
        <Text style={s.subtitle}>Slikaj odpadek ali skeniraj črtno kodo.</Text>

        {loadingBins && (
          <View style={s.loadingBinsRow}>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={s.loadingBinsText}>Nalagam pravila...</Text>
          </View>
        )}
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
                <ActivityIndicator size="large" color="#22C55E" />
                <Text style={s.loadingText}>Analiziram...</Text>
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
            <Text style={s.resultItem}>{result.item} 🌿</Text>

            <Text style={s.resultLabel}>Odloži v:</Text>
            <Text
              style={[
                s.resultBin,
                { color: BIN_COLORS[result.bin.color] ?? BIN_COLORS[result.binId] ?? "#1F2937" },
              ]}
            >
              ● {result.bin.name ?? "Neznan zabojnik"}
            </Text>

            <Text style={s.resultDesc}>{result.bin.description ?? ""}</Text>
          </View>
        )}

        {result && !loading && (
          <View style={s.rulesCard}>
            <View style={s.rulesCol}>
              <Text style={s.rulesTitle}>✅ Dovoljeno</Text>

              {(result.bin.allowed ?? []).slice(0, 4).map((item, index) => (
                <Text key={index} style={s.rulesItem}>
                  • {item}
                </Text>
              ))}
            </View>

            <View style={s.rulesDivider} />

            <View style={s.rulesCol}>
              <Text style={s.rulesTitleRed}>❌ Ni dovoljeno</Text>

              {(result.bin.notAllowed ?? []).slice(0, 4).map((item, index) => (
                <Text key={index} style={s.rulesItem}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        )}

        {result && !loading && (
          <View style={s.tipCard}>
            <Text style={s.tipTitle}>Lari nasvet ✦</Text>
            <Text style={s.tipText}>{result.bin.tip}</Text>
          </View>
        )}
      </ScrollView>

      <View style={s.buttonsRow}>
        {!result ? (
          <>
            <TouchableOpacity
              style={[s.mainBtn, loadingBins && { opacity: 0.4 }]}
              onPress={takePicture}
              disabled={loadingBins}
            >
              <Text style={s.mainBtnText}>📷 Slikaj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.secondBtn, loadingBins && { opacity: 0.4 }]}
              onPress={() => {
                setScanMode("barcode");
                setBarcodeScanning(true);
              }}
              disabled={loadingBins}
            >
              <Text style={s.secondBtnText}>Črtna koda</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.secondBtn, loadingBins && { opacity: 0.4 }]}
              onPress={pickFromGallery}
              disabled={loadingBins}
            >
              <Text style={s.secondBtnText}>🖼</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={s.mainBtn} onPress={resetScan}>
              <Text style={s.mainBtnText}>🔄 Znova</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.secondBtn}
              onPress={() => setScanMode("manual")}
            >
              <Text style={s.secondBtnText}>Ročno</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute="Scanner" />
    </SafeAreaView>
  );
}