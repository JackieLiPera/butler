import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Pressable, Alert } from "react-native";
import { ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import { DateField, BottomNav } from "../components";
import { updateProfile } from "../utils/accountRequestHandlers";
import type { RootStackParamList } from "../types";

type Route = RouteProp<RootStackParamList, "ManageAccount">;

export default function ManageAccountScreen() {
  const route = useRoute<Route>();
  const { user } = route.params;
  const [error, setError] = useState("");

  if (!user) {
    setError("You must be signed in.");
    return;
  }

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [birthday, setBirthday] = useState<Date>(user.birthday);
  const [phone, setPhone] = useState(user.phone || "");

  const [phoneBanner, setPhoneBanner] = useState("");

  const handleUpdate = async () => {
    try {
      await updateProfile({ firstName, lastName, birthday, phone }, user.uid);
      Alert.alert("Success", "Your profile has been updated.");
    } catch (err) {
      Alert.alert("Error", "Could not update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (!phone) {
      setPhoneBanner("Please add your primary phone number.");
    }
  }, [phone]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container}>
            <Text style={styles.header}>Account Info</Text>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user.email}
              editable={false}
            />
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user.username}
              editable={false}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="(555) 555-5555"
              maxLength={14}
            />
            {phoneBanner && (
              <View style={styles.banner}>
                <Text style={styles.bannerText}>{phoneBanner}</Text>
              </View>
            )}
            <Text style={styles.label}>Birthday</Text>
            <DateField
              setDate={setBirthday}
              initialValue={birthday}
              label="Birthday *"
              disabled
            />
            {error && <Text style={{ color: "red" }}>{error}</Text>}

            <Pressable style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </Pressable>

            <BottomNav user={user} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 24,
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f4f4f4",
    color: "#999",
  },
});
