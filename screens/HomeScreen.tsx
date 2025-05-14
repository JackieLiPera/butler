import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, Region, Callout } from "react-native-maps";
import { ONE_MILE_IN_METERS } from "../constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { acceptRequest, mapStyle } from "../utils";
import { useLoadHomeScreen } from "../hooks/useLoadHomeScreen";
import { Picker } from "@react-native-picker/picker";
import { Banner, BottomNav, Button } from "../components";
import Toast from "react-native-toast-message";
import type { RootStackParamList, Request } from "../types";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Route = RouteProp<RootStackParamList, "Home">;

export default function HomeScreen({
  navigation,
}: {
  navigation: HomeScreenNavigationProp;
}) {
  const route = useRoute<Route>();
  const { toast } = route.params || {};
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [warningBanner, setWarningBanner] = useState<string>("");
  const [errorBanner, setErrorBanner] = useState<string>("");
  const [pendingRequest, setPendingRequest] = useState<Request | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  const { error, warning, ready, data } = useLoadHomeScreen();

  const { location, requests, user } = data || {};

  useEffect(() => {
    if (error) {
      setErrorBanner(error);
    }
    if (warning) {
      setWarningBanner(error);
    }
  }, [error, warning, route.params]);

  useFocusEffect(
    useCallback(() => {
      if (toast) {
        Toast.show({
          type: toast.type,
          text1: toast.text1,
          text2: toast.text2,
          visibilityTime: 5000,
          position: "top",
          topOffset: 150,
        });
        navigation.setParams({ toast: undefined });
      }
    }, [route.params?.toast])
  );

  const handleAccept = useCallback(async (request: Request) => {
    try {
      if (user) {
        await acceptRequest({
          ...request,
          acceptedUser: user,
          duration: durationMinutes,
        });

        Toast.show({
          type: "success",
          text1: "Request Accepted",
          text2: "Track the request on the Request History page.",
          visibilityTime: 5000,
          position: "top",
          topOffset: 150,
        });
        setSelectedRequest(null);
        setPendingRequest(null);
      }
    } catch (e) {
      if (e instanceof Error) {
        setErrorBanner(e.message);
      }
    }
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
          {warningBanner && (
            <Banner
              text={warningBanner}
              type="warning"
              callback={() => {
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
            </Banner>
          )}
          {errorBanner && (
            <Banner
              text={errorBanner}
              type="error"
              callback={() => {
                navigation.navigate("Settings", { user });
              }}
            >
              <Ionicons
                name="settings-outline"
                size={16}
                color="#333"
                style={{ marginRight: 6 }}
              />

              <Text style={styles.linkText}>Settings</Text>
            </Banner>
          )}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("CreateRequest");
            }}
            disabled={Boolean(warningBanner) || Boolean(errorBanner)}
            style={({ pressed }) => [
              styles.buttonPressable,
              (Boolean(warningBanner) || Boolean(errorBanner)) &&
                styles.buttonDisabled,
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
            onPress={() => {
              setSelectedRequest(null);
              setPendingRequest(null);
            }}
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
          {pendingRequest && (
            <>
              <Text style={styles.calloutText}>
                Estimated time to complete the request:
              </Text>
              <Picker
                selectedValue={durationMinutes}
                onValueChange={(value) => setDurationMinutes(value)}
              >
                {[...Array(24 * 4)].map((_, i) => {
                  const minutes = (i + 1) * 5;
                  return (
                    <Picker.Item
                      key={minutes}
                      label={`${
                        minutes >= 60 ? `${minutes / 60} hr` : `${minutes} min`
                      }`}
                      value={minutes}
                    />
                  );
                })}
              </Picker>
            </>
          )}
          <Button
            variation="filled"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (pendingRequest) {
                handleAccept(selectedRequest);
              } else {
                setPendingRequest(selectedRequest);
              }
            }}
            text={pendingRequest ? "Submit" : "Accept Request"}
          />
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
  linkText: {
    fontWeight: "700",
    color: "#000",
  },
});
