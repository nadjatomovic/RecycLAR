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
import { CameraView as BarcodeCameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────
type BinData = {
  name: string;
  color: string;
  description: string;
  tip: string;
  allowed: string[];
  notAllowed: string[];
};
type BinsMap = Record<string, BinData>;
type ScanMode = "camera" | "barcode" | "manual";

// ─── Bin colors ───────────────────────────────────────────────────────────────
const BIN_COLORS: Record<string, string> = {
  blue: "#2B7DE9",
  yellow: "#F2B400",
  green: "#32A852",
  brown: "#8A5A32",
  mixed: "#1F2937",
  red: "#EF4444",
};

// ─── Map item name → bin (used by barcode + manual) ──────────────────────────
const mapItemToBin = (item: string): string => {
  const lower = item.toLowerCase();
  if (lower.includes("paper") || lower.includes("papir") || lower.includes("cardboard") || lower.includes("karton") || lower.includes("newspaper") || lower.includes("časopis")) return "blue";
  if (lower.includes("plastic") || lower.includes("plastik") || lower.includes("bottle") || lower.includes("can") || lower.includes("metal") || lower.includes("embalaža") || lower.includes("packaging") || lower.includes("pločevin")) return "yellow";
  if (lower.includes("glass") || lower.includes("steklo") || lower.includes("steklenica")) return "green";
  if (lower.includes("food") || lower.includes("bio") || lower.includes("organic") || lower.includes("fruit") || lower.includes("vegetable") || lower.includes("hrana") || lower.includes("banana")) return "brown";
  return "mixed";
};

// ─── Get Lari tip from Gemini ─────────────────────────────────────────────────
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
              text: `Napiši SAMO en praktičen nasvet v slovenščini kako pravilno pripraviti "${itemName}" pred odlaganjem v "${binName}". Na primer: "Stisni plastenko in odstrani pokrovček." ali "Izperi kozarec pred odlaganjem." Odgovori SAMO z nasvetom, brez uvoda, brez razlage, brez vprašanj.`
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

// ─── Component ───────────────────────────────────────────────────────────────
export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBins, setLoadingBins] = useState(true);
  const [result, setResult] = useState<{ item: string; bin: BinData; binId: string } | null>(null);
  const [bins, setBins] = useState<BinsMap>({});
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [manualInput, setManualInput] = useState("");
  const [barcodeScanning, setBarcodeScanning] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    loadBinsFromFirebase();
  }, []);

  // ─── Load bins from Firebase ────────────────────────────────────────────────
  const loadBinsFromFirebase = async () => {
    setLoadingBins(true);
    try {
      const binsSnap = await getDocs(collection(db, "municipalities", "maribor", "bins"));
      const binsData: BinsMap = {};
      binsSnap.forEach((doc) => { binsData[doc.id] = doc.data() as BinData; });
      setBins(binsData);
    } catch {
      setBins({
        blue:   { name: "Modri zabojnik",   color: "blue",   description: "Zabojnik za papir.",       tip: "Papir naj bo čist in suh.",              allowed: ["Čist papir", "Karton"],    notAllowed: ["Masten papir"] },
        yellow: { name: "Rumeni zabojnik",  color: "yellow", description: "Zabojnik za embalažo.",    tip: "Stisni plastenko pred odlaganjem.",       allowed: ["Plastika", "Kovine"],      notAllowed: ["Umazana embalaža"] },
        green:  { name: "Zeleni zabojnik",  color: "green",  description: "Zabojnik za steklo.",      tip: "Izprazni steklenico pred odlaganjem.",   allowed: ["Steklo"],                  notAllowed: ["Keramika"] },
        brown:  { name: "Rjavi zabojnik",   color: "brown",  description: "Zabojnik za bio odpadke.", tip: "Samo organski odpadki.",                  allowed: ["Hrana", "Bio"],            notAllowed: ["Plastične vrečke"] },
        mixed:  { name: "Mešani odpadki",   color: "mixed",  description: "Za kar ne gre drugam.",    tip: "Sem gre kar se ne da razvrstiti.",        allowed: ["Mešani odpadki"],          notAllowed: [] },
      });
    } finally {
      setLoadingBins(false);
    }
  };

  // ─── Show result with optional Gemini tip ──────────────────────────────────
  const showResult = async (itemName: string) => {
    const binId = mapItemToBin(itemName);
    const bin = bins[binId] ?? bins["mixed"];
    // Set result immediately with Firebase tip
    setResult({ item: itemName, bin, binId });
    // Then try to get Gemini Lari tip
    const geminiTip = await getLariTip(itemName, bin.name);
    if (geminiTip) {
      setResult({ item: itemName, bin: { ...bin, tip: geminiTip }, binId });
    }
  };

  // ─── Camera: take picture ──────────────────────────────────────────────────
  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setResult(null);
    try {
      const pic = await cameraRef.current.takePictureAsync({ base64: false });
      setPhoto(pic.uri);
      // Without Gemini vision — ask user to identify manually or use barcode
      Alert.alert(
        "Odpadek posnet! 📷",
        "Kako želiš identificirati odpadek?",
        [
          { text: "🔲 Skeniraj črtno kodo", onPress: () => { setPhoto(null); setScanMode("barcode"); setBarcodeScanning(true); } },
          { text: "✍️ Vnesi ročno", onPress: () => { setScanMode("manual"); } },
          { text: "Prekliči", onPress: () => setPhoto(null), style: "cancel" },
        ]
      );
    } catch {
      Alert.alert("Napaka", "Fotografiranje ni uspelo.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Gallery pick ──────────────────────────────────────────────────────────
  const pickFromGallery = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.7,
    });
    if (!picked.canceled && picked.assets[0]) {
      setPhoto(picked.assets[0].uri);
      Alert.alert(
        "Slika izbrana! 🖼",
        "Kako želiš identificirati odpadek?",
        [
          { text: "🔲 Skeniraj črtno kodo", onPress: () => { setPhoto(null); setScanMode("barcode"); setBarcodeScanning(true); } },
          { text: "✍️ Vnesi ročno", onPress: () => setScanMode("manual") },
          { text: "Prekliči", onPress: () => setPhoto(null), style: "cancel" },
        ]
      );
    }
  };

  // ─── Barcode scan ──────────────────────────────────────────────────────────
  const handleBarcodeScan = async ({ data: barcode }: { data: string }) => {
    if (!barcodeScanning) return;
    setBarcodeScanning(false);
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const product = data.product;
        const itemName = product.product_name || product.product_name_sl || barcode;
        const packaging = product.packaging || product.packaging_text || "";
        const searchText = `${itemName} ${packaging}`;
        setLoading(false);
        setScanMode("camera");
        await showResult(searchText);
      } else {
        setLoading(false);
        setScanMode("camera");
        Alert.alert("Produkt ni najden", "Ta produkt ni v bazi. Poskusi ročni vnos.", [
          { text: "✍️ Vnesi ročno", onPress: () => setScanMode("manual") },
          { text: "Prekliči" },
        ]);
      }
    } catch {
      setLoading(false);
      setScanMode("camera");
      Alert.alert("Napaka", "Ni se uspelo povezati z bazo produktov.");
    }
  };

  // ─── Manual search ─────────────────────────────────────────────────────────
  const handleManualSearch = async () => {
    if (!manualInput.trim()) return;
    setLoading(true);
    setScanMode("camera");
    setManualInput("");
    await showResult(manualInput.trim());
    setLoading(false);
  };

  const resetScan = () => {
    setPhoto(null);
    setResult(null);
    setScanMode("camera");
    setManualInput("");
    setBarcodeScanning(false);
  };

  // ─── Permission screen ─────────────────────────────────────────────────────
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

  // ─── Barcode mode ──────────────────────────────────────────────────────────
  if (scanMode === "barcode") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScanMode("camera")} style={s.backBtn}>
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>
            <Text style={s.headerGreen}>Skeniraj</Text>
            <Text style={s.headerPurple}> črtno kodo</Text>
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.cameraBox}>
          <BarcodeCameraView
            style={s.camera}
            facing="back"
            onBarcodeScanned={barcodeScanning ? handleBarcodeScan : undefined}
          />
          <View style={s.cornerTL} /><View style={s.cornerTR} />
          <View style={s.cornerBL} /><View style={s.cornerBR} />
          <View style={s.goodLight}>
            <Text style={s.goodLightText}>🔲 Usmeri na črtno kodo</Text>
          </View>
        </View>
        {loading && (
          <View style={s.centerLoader}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={s.loadingBinsText}>Iščem produkt...</Text>
          </View>
        )}
        <View style={s.buttonsRow}>
          <TouchableOpacity style={s.secondBtn} onPress={() => { setScanMode("manual"); }}>
            <Text style={s.secondBtnText}>✍️ Vnesi ročno</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.mainBtn} onPress={() => setScanMode("camera")}>
            <Text style={s.mainBtnText}>← Nazaj</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} activeRoute="Scanner" />
      </SafeAreaView>
    );
  }

  // ─── Manual mode ──────────────────────────────────────────────────────────
  if (scanMode === "manual") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScanMode("camera")} style={s.backBtn}>
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
          <Text style={s.subtitle}>Vpiši ime odpadka ali produkta</Text>
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
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.mainBtnText}>🔍 Poišči</Text>
            }
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} activeRoute="Scanner" />
      </SafeAreaView>
    );
  }

  // ─── Main camera mode ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ width: 40 }} />
        <Text style={s.headerTitle}>
          <Text style={s.headerGreen}>Recyc</Text>
          <Text style={s.headerPurple}>LAR</Text>
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Title */}
      <View style={s.titleRow}>
        <Text style={s.title}>Skener ✦</Text>
        <Text style={s.subtitle}>Slikaj odpadek ali skeniraj črtno kodo.</Text>
        {loadingBins && (
          <View style={s.loadingBinsRow}>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={s.loadingBinsText}>Nalagam pravila za Maribor...</Text>
          </View>
        )}
      </View>

      {/* Camera / photo */}
      <View style={s.cameraBox}>
        {!photo ? (
          <>
            <CameraView ref={cameraRef} style={s.camera} facing="back" />
            <View style={s.cornerTL} /><View style={s.cornerTR} />
            <View style={s.cornerBL} /><View style={s.cornerBR} />
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
                <Text style={s.loadingText}>Analiziram odpadek...</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Results */}
      <ScrollView style={s.resultsScroll} contentContainerStyle={s.resultsContent}>
        {result && !loading && (
          <View style={s.resultCard}>
            <Text style={s.resultLabel}>Prepoznano:</Text>
            <Text style={s.resultItem}>{result.item} 🌿</Text>
            <Text style={s.resultLabel}>Odloži v:</Text>
            <Text style={[s.resultBin, { color: BIN_COLORS[result.binId] ?? "#1F2937" }]}>
              ● {result.bin.name ?? "Neznan zabojnik"}
            </Text>
            <Text style={s.resultDesc}>{result.bin.description ?? ""}</Text>
          </View>
        )}

        {result && !loading && (
          <View style={s.rulesCard}>
            <View style={s.rulesCol}>
              <Text style={s.rulesTitle}>✅ Dovoljeno</Text>
              {(result.bin.allowed ?? []).slice(0, 4).map((item, i) => (
                <Text key={i} style={s.rulesItem}>• {item}</Text>
              ))}
            </View>
            <View style={s.rulesDivider} />
            <View style={s.rulesCol}>
              <Text style={s.rulesTitleRed}>❌ Ni dovoljeno</Text>
              {(result.bin.notAllowed ?? []).slice(0, 4).map((item, i) => (
                <Text key={i} style={s.rulesItem}>• {item}</Text>
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

      {/* Buttons */}
      <View style={s.buttonsRow}>
        {!result ? (
          <>
            <TouchableOpacity style={s.mainBtn} onPress={takePicture} disabled={loadingBins}>
              <Text style={s.mainBtnText}>📷 Slikaj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondBtn} onPress={() => { setScanMode("barcode"); setBarcodeScanning(true); }} disabled={loadingBins}>
              <Text style={s.secondBtnText}>🔲 Črtna koda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondBtn} onPress={pickFromGallery} disabled={loadingBins}>
              <Text style={s.secondBtnText}>🖼</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={s.mainBtn} onPress={resetScan}>
              <Text style={s.mainBtnText}>🔄 Znova</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondBtn} onPress={() => setScanMode("manual")}>
              <Text style={s.secondBtnText}>✍️ Ročno</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute="Scanner" />
    </SafeAreaView>
  );
}

const s = {
  container:       { flex: 1, backgroundColor: "#F8FAF5" },
  header:          { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 },
  backBtn:         { width: 40, height: 40, justifyContent: "center" as const },
  backText:        { fontSize: 28, color: "#1F2937" },
  headerTitle:     { fontSize: 20, fontWeight: "700" as const },
  headerGreen:     { color: "#22C55E" },
  headerPurple:    { color: "#7C3AED" },
  titleRow:        { paddingHorizontal: 20, paddingBottom: 10 },
  title:           { fontSize: 26, fontWeight: "700" as const, color: "#1F2937", marginBottom: 2 },
  subtitle:        { fontSize: 14, color: "#6B7280" },
  loadingBinsRow:  { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, marginTop: 6 },
  loadingBinsText: { fontSize: 12, color: "#6B7280" },
  cameraBox:       { height: 320, marginHorizontal: 20, borderRadius: 16, overflow: "hidden" as const, position: "relative" as const, backgroundColor: "#000" },
  camera:          { flex: 1 },
  photo:           { width: "100%" as const, height: "100%" as const },
  cornerTL:        { position: "absolute" as const, top: 16, left: 16, width: 28, height: 28, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "#22C55E", borderTopLeftRadius: 5 },
  cornerTR:        { position: "absolute" as const, top: 16, right: 16, width: 28, height: 28, borderTopWidth: 3, borderRightWidth: 3, borderColor: "#22C55E", borderTopRightRadius: 5 },
  cornerBL:        { position: "absolute" as const, bottom: 16, left: 16, width: 28, height: 28, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "#22C55E", borderBottomLeftRadius: 5 },
  cornerBR:        { position: "absolute" as const, bottom: 16, right: 16, width: 28, height: 28, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "#22C55E", borderBottomRightRadius: 5 },
  goodLight:       { position: "absolute" as const, top: 12, alignSelf: "center" as const, backgroundColor: "#22C55E", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  goodLightText:   { color: "#fff", fontSize: 12, fontWeight: "600" as const },
  loadingOverlay:  { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" as const, alignItems: "center" as const },
  loadingText:     { color: "#fff", marginTop: 8, fontSize: 14 },
  centerLoader:    { alignItems: "center" as const, padding: 20, gap: 8 },
  resultsScroll:   { flex: 1 },
  resultsContent:  { padding: 16, paddingBottom: 8 },
  resultCard:      { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  resultLabel:     { fontSize: 12, color: "#6B7280", marginBottom: 2, marginTop: 6 },
  resultItem:      { fontSize: 18, fontWeight: "700" as const, color: "#22C55E" },
  resultBin:       { fontSize: 16, fontWeight: "700" as const, marginBottom: 4 },
  resultDesc:      { fontSize: 12, color: "#6B7280" },
  rulesCard:       { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row" as const, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  rulesCol:        { flex: 1 },
  rulesDivider:    { width: 1, backgroundColor: "#F3F4F6", marginHorizontal: 12 },
  rulesTitle:      { fontSize: 13, fontWeight: "700" as const, color: "#166534", marginBottom: 8 },
  rulesTitleRed:   { fontSize: 13, fontWeight: "700" as const, color: "#DC2626", marginBottom: 8 },
  rulesItem:       { fontSize: 12, color: "#374151", marginBottom: 4 },
  tipCard:         { backgroundColor: "#F0FDF4", borderRadius: 16, padding: 16, marginBottom: 8 },
  tipTitle:        { fontSize: 14, fontWeight: "700" as const, color: "#7C3AED", marginBottom: 4 },
  tipText:         { fontSize: 13, color: "#374151", lineHeight: 20 },
  buttonsRow:      { flexDirection: "row" as const, gap: 10, paddingHorizontal: 20, paddingVertical: 12 },
  mainBtn:         { flex: 1, backgroundColor: "#22C55E", borderRadius: 14, padding: 16, alignItems: "center" as const },
  mainBtnText:     { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
  secondBtn:       { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, alignItems: "center" as const, borderWidth: 1.5, borderColor: "#7C3AED" },
  secondBtnText:   { color: "#7C3AED", fontWeight: "700" as const, fontSize: 15 },
  manualContainer: { flex: 1, padding: 20, gap: 12 },
  manualInput:     { backgroundColor: "#fff", borderRadius: 14, padding: 16, fontSize: 15, borderWidth: 1.5, borderColor: "#E5E7EB", color: "#1F2937" },
  permText:        { textAlign: "center" as const, margin: 40, fontSize: 15, color: "#374151" },
  permBtn:         { backgroundColor: "#22C55E", borderRadius: 12, padding: 14, marginHorizontal: 40, alignItems: "center" as const },
  permBtnText:     { color: "#fff", fontWeight: "700" as const },
};