import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, Region } from "react-native-maps";
import * as Location from "expo-location";
import { ONE_MILE_IN_METERS } from "../constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Pressable } from "react-native";
import { auth } from "../firebase/config";
import * as Haptics from "expo-haptics";
import {
  collection,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Request } from "../types/request";
import { mapStyle } from "../utils";

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
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const init = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    };

    init();

    const unsubscribe = onSnapshot(collection(db, "requests"), (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(requestsData);
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = async (request: Request) => {
    alert(`You accepted the request: "${request.requestText}"`);
    setSelectedRequest(null);

    try {
      await updateDoc(doc(db, "requests", request.id), {
        // TODO after sign in is complete
        acceptedBy: currentUser?.uid,
        acceptedAt: Timestamp.now(),
      });
    } catch (e) {
      alert(
        `There was an error accepting the request: "${request.requestText}"`
      );

      console.log(e);
    }
  };

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
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={region}
        customMapStyle={mapStyle}
      >
        <Marker coordinate={{ latitude, longitude }} title="You" />
        <Circle
          center={{ latitude, longitude }}
          radius={ONE_MILE_IN_METERS}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.1)"
        />
        {requests.map((request) => {
          const { id, location, paymentAmount } = request;
          return (
            <Marker
              pinColor={paymentAmount ? "#228B22" : "#1E90FF"}
              key={id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onPress={() => setSelectedRequest(request)}
              description={paymentAmount ? `$${paymentAmount}` : undefined}
            />
          );
        })}
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

      {selectedRequest && (
        <View style={styles.panel}>
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
          <Pressable onPress={() => setSelectedRequest(null)}>
            <Text style={styles.panelClose}>Close</Text>
          </Pressable>
        </View>
      )}
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
  panel: {
    position: "absolute",
    bottom: 20,
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

  panelClose: {
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "500",
    textAlign: "right",
  },
  acceptButton: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  acceptButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
