import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { ONE_MILE_IN_METERS } from "../constants";
import {
  pickImage,
  createRequest,
  formatRadius,
  validateRequestText,
} from "../utils";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, HeaderText } from "../components";
import { auth } from "../firebase/config";
import Toast from "react-native-toast-message";

type CreateRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateRequest"
>;

export default function CreateRequestScreen({
  navigation,
}: {
  navigation: CreateRequestScreenNavigationProp;
}) {
  const [requestText, setRequestText] = useState("");
  const [radiusMeters, setRadiusMeters] = useState(ONE_MILE_IN_METERS / 2);
  const [payment, setPayment] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCreateRequest = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You must be logged in to create a request.");
      return;
    }
    try {
      await createRequest({
        requestText,
        radiusMeters,
        payment,
        imageUri,
        requesterUid: currentUser.uid,
      });
      navigation.navigate("Home", {
        toast: {
          type: "success",
          text1: "Request Created",
          text2: "Track your request on the Request History page.",
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }, [auth.currentUser, requestText, radiusMeters, payment]);

  const handlePickImage = useCallback(async () => {
    await pickImage({ setImageUri });
  }, [setImageUri]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#000" />
            </Pressable>
            <HeaderText>Create a Request</HeaderText>
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
            onBlur={() => {
              const invalidRequest = validateRequestText(requestText);
              if (invalidRequest) {
                setError(invalidRequest);
              } else {
                setError("");
              }
            }}
            maxLength={500}
          />
          {error && <Text style={styles.error}>{error}</Text>}
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
            minimumValue={1} // meters
            maximumValue={ONE_MILE_IN_METERS * 25}
            step={50} // meters
            value={radiusMeters}
            onValueChange={setRadiusMeters}
            minimumTrackTintColor="#000"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#000"
          />
          <Pressable style={styles.uploadBox} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="add" size={32} color="#999" />
                <Text style={styles.uploadText}>Add a picture (optional)</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleCreateRequest}
              text="Submit Request"
              variation="filled"
              disabled={Boolean(error) || !requestText}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  error: {
    color: "red",
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
  buttonContainer: {
    position: "static",
    bottom: 40,
    left: 20,
    right: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backButton: {
    marginRight: 8,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  uploadBox: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    minHeight: 180,
    maxHeight: 250,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
