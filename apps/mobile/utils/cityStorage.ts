import AsyncStorage from "@react-native-async-storage/async-storage";

const CITY_KEY = "selected_city";

export const saveCity = async (city: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(CITY_KEY, city);
  } catch (e) {
    console.log("saveCity error:", e);
  }
};

export const loadCity = async (): Promise<string> => {
  try {
    const city = await AsyncStorage.getItem(CITY_KEY);
    return city ?? "Maribor";
  } catch (e) {
    return "Maribor";
  }
};
