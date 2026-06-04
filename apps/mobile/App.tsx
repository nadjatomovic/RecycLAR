import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MapScreen from "./screens/MapScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BinDetailScreen from "./screens/Bindetailscreen";
import ScannerScreen from "./screens/ScannerScreen";
import QuizScreen from "./screens/QuizScreen";
import LeaderboardScreen from "./screens/LeaderBoardScreen";
import AchievementsScreen from "./screens/AchievementsScreen";
import ActivityHistoryScreen from "./screens/ActivityHistoryScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import TeacherClassDetailScreen from "./screens/TeacherClassDetailScreen";
import TeacherClassesScreen from "./screens/TeacherClassesScreen";

export type RootStackParamList = {
  Home: undefined;
  Dashboard: { selectedCity?: string } | undefined;
  Map: { municipality?: string } | undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  BinDetail: { binId: string };
  Scanner: undefined;
  Quiz: undefined;
  Leaderboard: undefined;
  Achievements: undefined;
  ActivityHistory: undefined;
  EditProfile: undefined;
  TeacherClasses: undefined;
  TeacherClassDetail: {
  groupId: string;
  groupName: string;
  schoolName?: string;
  inviteCode?: string;
};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="BinDetail" component={BinDetailScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="ActivityHistory" component={ActivityHistoryScreen} />
        <Stack.Screen name="TeacherClasses" component={TeacherClassesScreen} />
        <Stack.Screen name="TeacherClassDetail" component={TeacherClassDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
