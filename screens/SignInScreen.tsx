import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackParamList } from "../types/navigation";
import { checkUsernameAvailability, errorMap, signIn, signUp } from "../utils";
import { APP_NAME } from "../constants";
import DateField from "../components/DateField";
import { useNavigation } from "@react-navigation/native";

export default function SignInScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [birthday, setBirthday] = useState<Date>(new Date());

  const [isSignUp, setIsSignUp] = useState<boolean | null>(null);

  const handleSignIn = useCallback(async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }
    try {
      await signIn({ email, password });
      navigation.navigate("Home");
    } catch (e: unknown) {
      if (e instanceof Error) {
        // @ts-expect-error
        setError(errorMap[e.message] || "Internal error.");
      } else {
        console.error("Unknown error:", e);
      }
    }
  }, [email, password]);

  const handleSignUp = useCallback(async () => {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !birthday ||
      !email ||
      !password
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (error) return;

    try {
      await signUp({
        firstName,
        lastName,
        username,
        birthday,
        email,
        password,
      });
      navigation.navigate("Home");
    } catch (e: unknown) {
      if (e instanceof Error) {
        // @ts-expect-error
        setError(errorMap[e.message] || "Internal error.");
      } else {
        console.error("Unknown error:", e);
      }
    }
  }, [firstName, lastName, username, email, birthday, password]);

  const handleCheckUsernameAvailability = useCallback(
    async (value: string) => {
      const isAvailable = await checkUsernameAvailability(value);

      if (isAvailable) {
        setError("");
      } else {
        setError("Username is not available. Try again.");
      }
    },
    [setUserName]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          {isSignUp === null ? (
            <>
              <Text style={styles.logo}>{APP_NAME}</Text>

              <Pressable
                style={styles.outlinedButton}
                onPress={() => setIsSignUp(false)}
              >
                <Text style={styles.outlinedButtonText}>Sign In</Text>
              </Pressable>

              <Pressable
                style={styles.outlinedButton}
                onPress={() => setIsSignUp(true)}
              >
                <Text style={styles.outlinedButtonText}>Sign Up</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.header}>
                {isSignUp ? "Sign Up" : "Sign In"}
              </Text>
              {isSignUp ? (
                <>
                  <TextInput
                    placeholder="First Name *"
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    onBlur={() => {
                      if (!firstName.trim()) {
                        setError("First name is required.");
                      }
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name *"
                    value={lastName}
                    onChangeText={setLastName}
                    onBlur={() => {
                      if (!lastName.trim()) {
                        setError("Last name is required.");
                      }
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Username *"
                    value={username}
                    onChangeText={(val) => {
                      setUserName(val);
                    }}
                    onBlur={() => {
                      if (!username.trim()) {
                        setError("Username is required.");
                      }

                      handleCheckUsernameAvailability(username);
                    }}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError("");
                    }}
                    onBlur={() => {
                      const trimmed = email.trim();
                      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        trimmed
                      );

                      if (!trimmed) {
                        setError("Email is required.");
                      } else if (!isValidEmail) {
                        setError("Please enter a valid email address.");
                      }
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password *"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    onBlur={() => {
                      if (!password) {
                        setError("Password is required.");
                      }
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Password Again *"
                    value={confirmPassword}
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    onBlur={() => {
                      if (password != confirmPassword) {
                        setError("Passwords must match.");
                      }
                    }}
                  />

                  <DateField
                    setDate={setBirthday}
                    initialValue={birthday}
                    label="Birthday *"
                  />

                  {/* Finish Setting up your profile */}
                  {/* <Pressable
                    onPress={() => pickLicenseImage(setLicenseUri)}
                    style={styles.uploadBox}
                  >
                    {licenseUri ? (
                      <Image
                        source={{ uri: licenseUri }}
                        style={styles.uploadedImage}
                      />
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <Ionicons name="add" size={32} color="#999" />
                        <Text style={styles.uploadText}>
                          Upload a picture of legal identification
                        </Text>
                      </View>
                    )}
                  </Pressable> */}

                  {error ? <Text style={styles.error}>{error}</Text> : null}

                  <Pressable
                    style={() => [
                      styles.outlinedButton,
                      Boolean(error) && styles.buttonDisabled,
                    ]}
                    onPress={handleSignUp}
                    disabled={Boolean(error)}
                  >
                    <Text style={styles.outlinedButtonText}>
                      Create Account
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError("");
                    }}
                    onBlur={() => {
                      const trimmed = email.trim();
                      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        trimmed
                      );

                      if (!trimmed) {
                        setError("Email is required.");
                      } else if (!isValidEmail) {
                        setError("Please enter a valid email address.");
                      }
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password *"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    onBlur={() => {
                      if (!password.trim()) {
                        setError("Password is required.");
                      }
                    }}
                  />

                  {error ? <Text style={styles.error}>{error}</Text> : null}
                  <Pressable
                    style={styles.outlinedButton}
                    onPress={handleSignIn}
                  >
                    <Text style={styles.outlinedButtonText}>Sign In</Text>
                  </Pressable>
                </>
              )}
              <Pressable
                onPress={() => {
                  setIsSignUp(null);
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
              >
                <Text style={styles.back}>← Back</Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.3,
  },
  error: {
    color: "red",
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
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadText: {
    color: "#666",
    fontSize: 14,
  },
  logo: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 48,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  outlinedButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
  },
  back: {
    color: "#000",
    marginTop: 16,
    fontSize: 16,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});
