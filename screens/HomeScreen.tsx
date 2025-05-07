import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, Region } from "react-native-maps";
import * as Location from "expo-location";
import { ONE_MILE_IN_METERS } from "../constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen({
  navigation,
}: {
  navigation: HomeScreenNavigationProp;
}) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!location) {
    return <ActivityIndicator size="large" />;
  }

  const { latitude, longitude } = location.coords;
  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Butler</Text>
      </View>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude, longitude }} title="You" />
        <Circle
          center={{ latitude, longitude }}
          radius={ONE_MILE_IN_METERS}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.1)"
        />
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("CreateRequest");
            }}
            style={({ pressed }) => [
              styles.buttonPressable,
              pressed && { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <Text style={styles.buttonText}>Create a Request</Text>
          </Pressable>
        </View>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonPressable: {
    backgroundColor: "white",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
});
