import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/config";
import * as Location from "expo-location";

import { APP_NAME } from "../constants";
import { BottomNav } from "../components";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../types";

const openAppSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};

type Route = RouteProp<RootStackParamList, "Settings">;

export default function SettingsScreen() {
  const route = useRoute<Route>();
  const { user } = route.params;

  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      try {
        setLocationEnabled(status === "granted");
      } catch (e) {
        Alert.alert("Error", "Failed to load location settings.");
      }
    };

    loadData();
  }, []);

  const handleToggle = async (value: boolean) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    openAppSettings();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={() => handleToggle(!locationEnabled)}
      >
        <Ionicons
          name="location-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Location Services</Text>
          <Text style={styles.description}>
            Allow {APP_NAME} to use your location to show and receive nearby
            requests.
          </Text>
        </View>
        <Switch value={locationEnabled} onValueChange={handleToggle} />
      </Pressable>
      <BottomNav user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    paddingRight: 4,
  },
});
