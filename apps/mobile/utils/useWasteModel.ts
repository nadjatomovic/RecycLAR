import { loadTensorflowModel, TensorflowModel } from "react-native-fast-tflite";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import * as ImageManipulator from "expo-image-manipulator";

const CLASSES = [
  "biodegradable",
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash",
];

let model: TensorflowModel | null = null;

export const loadModel = async () => {
  if (model) return model;

  const dest = FileSystem.cacheDirectory + "recyclar_model.tflite";

  const info = await FileSystem.getInfoAsync(dest);
  if (info.exists) {
    await FileSystem.deleteAsync(dest);
  }

  const asset = Asset.fromModule(
    require("../assets/model/recyclar_model.tflite")
  );
  await asset.downloadAsync();
  await FileSystem.copyAsync({ from: asset.localUri!, to: dest });

  console.log("Loading from:", dest);

  // ← [] je obvezen drugi parameter!
  model = await loadTensorflowModel({ url: dest }, []);
  console.log("✅ Model naložen!");
  return model;
};

export const classifyImage = async (
  imageUri: string
): Promise<{ className: string; confidence: number }> => {
  const m = await loadModel();

  // Resize na 224x224
  const resized = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 224, height: 224 } }],
    { format: ImageManipulator.SaveFormat.JPEG, base64: true, compress: 1.0 }
  );

  if (!resized.base64) throw new Error("No base64");

  // Fetch sliko in preberi kot ArrayBuffer
  const response = await fetch(resized.uri);
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  console.log("Total bytes:", bytes.length);
  console.log("Expected:", 224 * 224 * 3);

  // Vzami zadnje 224*224*3 bytes kot RGB
  const pixelCount = 224 * 224 * 3;
  const float32 = new Float32Array(pixelCount);

  // Vzami od ZAČETKA, ne konca
  for (let i = 0; i < pixelCount; i++) {
    float32[i] = ((i < bytes.length ? bytes[i] : 0) / 127.5) - 1.0;
  }

  const output = await m.run([float32.buffer]);
  const predictions = new Float32Array(output[0] as any);
  const scores = Array.from(predictions);

  console.log("Scores:", scores);

  const maxIdx = scores.indexOf(Math.max(...scores));

  return {
    className: CLASSES[maxIdx],
    confidence: scores[maxIdx],
  };
};