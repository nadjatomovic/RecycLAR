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
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

type BinData = {
  name: string;
  color: string;
  description: string;
  tip: string;
  allowed: string[];
  notAllowed: string[];
};

type BinsMap = Record<string, BinData>;

const BIN_COLORS: Record<string, string> = {
  blue: "#2B7DE9",
  yellow: "#F2B400",
  green: "#32A852",
  brown: "#8A5A32",
  mixed: "#1F2937",
  red: "#EF4444",
};

const mapGeminiToBin = (response: string): string => {
  const lower = response.toLowerCase();
  if (lower.includes("paper") || lower.includes("papir") || lower.includes("newspaper") || lower.includes("cardboard") || lower.includes("karton")) return "blue";
  if (lower.includes("plastic") || lower.includes("plastik") || lower.includes("bottle") || lower.includes("can") || lower.includes("metal") || lower.includes("embalaža") || lower.includes("packaging")) return "yellow";
  if (lower.includes("glass") || lower.includes("steklo") || lower.includes("steklenica")) return "green";
  if (lower.includes("food") || lower.includes("bio") || lower.includes("organic") || lower.includes("fruit") || lower.includes("vegetable")) return "brown";
  return "mixed";
};

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBins, setLoadingBins] = useState(true);
  const [result, setResult] = useState<{ item: string; bin: BinData; binId: string } | null>(null);
  const [bins, setBins] = useState<BinsMap>({});
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
      binsSnap.forEach((doc) => {
        binsData[doc.id] = doc.data() as BinData;
      });
      setBins(binsData);
    } catch (err) {
      console.log("Firebase bins load failed, using fallback");
      setBins({
        blue: { name: "Modri zabojnik", color: "blue", description: "Zabojnik za papir.", tip: "Papir naj bo čist in suh.", allowed: ["Čist papir", "Karton"], notAllowed: ["Masten papir"] },
        yellow: { name: "Rumeni zabojnik", color: "yellow", description: "Zabojnik za embalažo.", tip: "Stisni plastenko pred odlaganjem.", allowed: ["Plastika", "Kovine"], notAllowed: ["Umazana embalaža"] },
        green: { name: "Zeleni zabojnik", color: "green", description: "Zabojnik za steklo.", tip: "Izprazni steklenico.", allowed: ["Steklo"], notAllowed: ["Keramika"] },
        brown: { name: "Rjavi zabojnik", color: "brown", description: "Zabojnik za bio odpadke.", tip: "Samo organski odpadki.", allowed: ["Hrana", "Bio"], notAllowed: ["Plastične vrečke"] },
        mixed: { name: "Mešani odpadki", color: "mixed", description: "Za kar ne gre drugam.", tip: "Sem gre kar se ne da razvrstiti.", allowed: ["Mešani odpadki"], notAllowed: [] },
      });
    } finally {
      setLoadingBins(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync({ base64: true });
      setPhoto(pic.uri);
      await analyzeWithGemini(pic.base64);
    }
  };

  const pickFromGallery = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      base64: true,
      quality: 0.7,
    });
    if (!picked.canceled && picked.assets[0]) {
      setPhoto(picked.assets[0].uri);
      await analyzeWithGemini(picked.assets[0].base64 ?? "");
    }
  };

  const analyzeWithGemini = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Identify this waste item in one word or short phrase (e.g. plastic bottle, glass bottle, newspaper, cardboard, food waste, metal can). Respond with only the item name, nothing else." },
                { inline_data: { mime_type: "image/jpeg", data: base64 } },
              ],
            }],
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const retryDelay = data?.error?.details?.find((d: any) => d["@type"]?.includes("RetryInfo"))?.retryDelay;
          const retryMsg = retryDelay ? ` Poskusi čez ${retryDelay}.` : " Poskusi čez nekaj minut.";
          Alert.alert("Kvota izčrpana", "Presegli ste dnevno brezplačno kvoto za AI." + retryMsg);
        } else {
          Alert.alert("Napaka AI", `Koda ${response.status}: ${data?.error?.message ?? "Neznana napaka."}`);
        }
        return;
      }

      const itemName = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "unknown";
      console.log("=== GEMINI ODGOVOR ===", itemName);
      const binId = mapGeminiToBin(itemName);
      const bin = bins[binId] ?? bins["mixed"];
      setResult({ item: itemName, bin, binId });
    } catch (err) {
      Alert.alert("Napaka", "Ni se uspelo povezati z AI. Preveri internetno povezavo.");
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setPhoto(null);
    setResult(null);
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

      {/* Title row */}
      <View style={s.titleRow}>
        <Text style={s.title}>Skener ✦</Text>
        <Text style={s.subtitle}>Usmeri kamero proti odpadku.</Text>
        {loadingBins && (
          <View style={s.loadingBinsRow}>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={s.loadingBinsText}>Nalagam pravila za Maribor...</Text>
          </View>
        )}
      </View>

      {/* Camera / photo preview — fixed height, outside ScrollView */}
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
                <Text style={s.loadingText}>Analiziram odpadek...</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Results — scrollable area */}
      <ScrollView style={s.resultsScroll} contentContainerStyle={s.resultsContent}>
        {result && !loading && (
          <View style={s.resultCard}>
            <Text style={s.resultLabel}>Prepoznano:</Text>
            <Text style={s.resultItem}>{result.item} 🌿</Text>
            <Text style={s.resultLabel}>Odloži v:</Text>
            <Text style={[s.resultBin, { color: BIN_COLORS[result.binId] ?? "#1F2937" }]}>
              ● {result.bin.name}
            </Text>
            <Text style={s.resultDesc}>{result.bin.description}</Text>
          </View>
        )}

        {result && !loading && (
          <View style={s.rulesCard}>
            <View style={s.rulesCol}>
              <Text style={s.rulesTitle}>✅ Dovoljeno</Text>
              {(result.bin.allowed ?? []).slice(0, 4).map((item: string, i: number) => (
                <Text key={i} style={s.rulesItem}>• {item}</Text>
              ))}
            </View>
            <View style={s.rulesDivider} />
            <View style={s.rulesCol}>
              <Text style={s.rulesTitleRed}>❌ Ni dovoljeno</Text>
              {(result.bin.notAllowed ?? []).slice(0, 4).map((item: string, i: number) => (
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

      {/* Buttons — fixed above navbar */}
      <View style={s.buttonsRow}>
        {!photo ? (
          <>
            <TouchableOpacity style={s.mainBtn} onPress={takePicture} disabled={loadingBins}>
              <Text style={s.mainBtnText}>📷 Slikaj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondBtn} onPress={pickFromGallery} disabled={loadingBins}>
              <Text style={s.secondBtnText}>🖼 Galerija</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={s.mainBtn} onPress={resetScan}>
            <Text style={s.mainBtnText}>🔄 Skeniraj znova</Text>
          </TouchableOpacity>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute="Scanner" />
    </SafeAreaView>
  );
}

const s = {
  container:       { flex: 1, backgroundColor: "#F8FAF5" },
  header:          { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 },
  headerTitle:     { fontSize: 20, fontWeight: "700" as const },
  headerGreen:     { color: "#22C55E" },
  headerPurple:    { color: "#7C3AED" },
  titleRow:        { paddingHorizontal: 20, paddingBottom: 10 },
  title:           { fontSize: 26, fontWeight: "700" as const, color: "#1F2937", marginBottom: 2 },
  subtitle:        { fontSize: 14, color: "#6B7280" },
  loadingBinsRow:  { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, marginTop: 6 },
  loadingBinsText: { fontSize: 12, color: "#6B7280" },
  // Camera box — fixed height, outside ScrollView so CameraView can render
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
  // Results area
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
  // Buttons
  buttonsRow:      { flexDirection: "row" as const, gap: 12, paddingHorizontal: 20, paddingVertical: 12 },
  mainBtn:         { flex: 1, backgroundColor: "#22C55E", borderRadius: 14, padding: 16, alignItems: "center" as const },
  mainBtnText:     { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
  secondBtn:       { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, alignItems: "center" as const, borderWidth: 1.5, borderColor: "#7C3AED" },
  secondBtnText:   { color: "#7C3AED", fontWeight: "700" as const, fontSize: 15 },
  // Permission screen
  permText:        { textAlign: "center" as const, margin: 40, fontSize: 15, color: "#374151" },
  permBtn:         { backgroundColor: "#22C55E", borderRadius: 12, padding: 14, marginHorizontal: 40, alignItems: "center" as const },
  permBtnText:     { color: "#fff", fontWeight: "700" as const },
};