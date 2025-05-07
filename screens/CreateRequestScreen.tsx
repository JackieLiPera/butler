import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { FEET_IN_ONE_METER, ONE_MILE_IN_METERS } from "../constants";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";

type CreateRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateRequest"
>;

const formatRadius = (meters: number) => {
  const feet = meters * FEET_IN_ONE_METER;
  const miles = meters / ONE_MILE_IN_METERS;

  if (miles < 0.25) {
    return `${Math.round(feet)} ft`;
  } else {
    return `${miles.toFixed(1)} mi`;
  }
};

export default function CreateRequestScreen({
  navigation,
}: {
  navigation: CreateRequestScreenNavigationProp;
}) {
  const [requestText, setRequestText] = useState("");
  const [radiusMeters, setRadiusMeters] = useState(ONE_MILE_IN_METERS / 2);
  const [payment, setPayment] = useState("");

  const handleSubmit = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    if (!requestText.trim()) {
      alert("Please enter a request.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    const requestData = {
      requestText,
      radiusMeters,
      paymentAmount: payment ? parseInt(payment, 10) : null,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "requests"), requestData);

      alert("Request submitted!");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerText}>Create a Request</Text>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="e.g. I’ll pay $10 for someone to bring me coffee from Blue Bottle"
        multiline
        value={requestText}
        onChangeText={(text) => {
          if (text.length <= 500) {
            setRequestText(text);
          }
        }}
        maxLength={500}
      />
      <Text style={styles.charCount}>{requestText.length}/500</Text>

      <Text style={styles.label}>Optional Payment ($)</Text>
      <TextInput
        style={styles.paymentInput}
        placeholder="e.g. 10"
        value={payment}
        onChangeText={(text) => {
          const onlyNums = text.replace(/[^0-9]/g, "");
          setPayment(onlyNums);
        }}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Radius: {formatRadius(radiusMeters)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={305} // meters
        maximumValue={ONE_MILE_IN_METERS * 25}
        step={50} // meters
        value={radiusMeters}
        onValueChange={setRadiusMeters}
        minimumTrackTintColor="#000"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#000"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Submit Request" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  paymentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 24,
  },
  buttonWrapper: {
    marginTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "600",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
});
