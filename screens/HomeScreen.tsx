import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, Region, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { ONE_MILE_IN_METERS } from "../constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { Request } from "../types/request";
import {
  acceptRequest,
  checkAccountCompleted,
  loadUser,
  mapStyle,
} from "../utils";
import { BottomNav } from "../components/BottomNav";
import { Profile } from "../types/profile";

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
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [ready, setReady] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);

  // Load User Data
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await loadUser();
        setUser(user);
      } catch (e: unknown) {
        // @ts-expect-error
        setBanner(e.message);
      }

      if (user) {
        const message = checkAccountCompleted(user);

        setBanner(message);
      }
    };

    getUser();
  }, []);

  // Check if user is fully setup,  Render markers when ready
  useEffect(() => {
    if (user) {
      const message = checkAccountCompleted(user);

      setBanner(message);
    }

    if (location && requests.length > 0) {
      setReady(true);
    }
  }, [user, location, requests]);

  // Get location and fetch markers
  useEffect(() => {
    const init = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setBanner("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    };

    init();

    const requestsRef = collection(db, "requests");
    const openRequests = query(requestsRef, where("acceptedAt", "==", null));

    const unsubscribe = onSnapshot(openRequests, (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(requestsData);
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = useCallback(async (request: Request) => {
    await acceptRequest(request);
    alert(`You accepted the request: "${request.requestText}"`);
    setSelectedRequest(null);
  }, []);

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
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={region}
        customMapStyle={mapStyle}
        key={ready ? "map-ready" : "map-waiting"}
      >
        <Marker coordinate={{ latitude, longitude }} title="You" />
        <Circle
          center={{ latitude, longitude }}
          radius={ONE_MILE_IN_METERS}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.1)"
        />
        {ready &&
          requests.map((request) => {
            const { id, location, paymentAmount } = request;
            if (
              !request.location ||
              !request.location.latitude ||
              !request.location.longitude
            ) {
              console.warn("⚠️ Skipping invalid marker:", request);
            }
            return (
              <Marker
                pinColor={paymentAmount ? "#228B22" : "#1E90FF"}
                key={id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                onPress={() => setSelectedRequest(request)}
              >
                <Callout tooltip>
                  <View style={styles.calloutBox}>
                    <Text style={styles.calloutText}>${paymentAmount}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}

        <View style={styles.buttonContainer}>
          {banner && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{banner}</Text>
              <Pressable
                style={styles.manageAccountLink}
                onPress={() => {
                  navigation.navigate("ManageAccount", { user });
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={16}
                  color="#333"
                  style={{ marginRight: 6 }}
                />

                <Text style={styles.linkText}>Manage Account</Text>
              </Pressable>
            </View>
          )}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("CreateRequest");
            }}
            disabled={Boolean(banner)}
            style={({ pressed }) => [
              styles.buttonPressable,
              Boolean(banner) && styles.buttonDisabled,
              pressed && { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <Text style={styles.buttonText}>Create a Request</Text>
          </Pressable>
        </View>
      </MapView>

      {selectedRequest && (
        <View style={styles.viewRequestPanel}>
          <Pressable
            onPress={() => setSelectedRequest(null)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.panelTitle}>{selectedRequest.requestText}</Text>
          {selectedRequest.paymentAmount && (
            <Text style={styles.panelDetail}>
              ${selectedRequest.paymentAmount}
            </Text>
          )}
          <Text style={styles.panelDetail}>
            Distance:{" "}
            {(selectedRequest.radius.meters / ONE_MILE_IN_METERS).toFixed(1)} mi
          </Text>

          <Pressable
            style={styles.acceptButton}
            onPress={() => handleAccept(selectedRequest)}
          >
            <Text style={styles.acceptButtonText}>Accept Request</Text>
          </Pressable>
        </View>
      )}

      <BottomNav user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 100, // (BottomNav + 20)

    overflow: "hidden",
  },
  buttonPressable: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  viewRequestPanel: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  panelDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  acceptButton: {
    marginTop: 12,
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  calloutBox: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  calloutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  banner: {
    backgroundColor: "#fff8dc",
    borderLeftWidth: 4,
    borderLeftColor: "#ffcc00",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bannerText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  linkText: {
    fontWeight: "700",
    color: "#000",
  },
  manageAccountLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
