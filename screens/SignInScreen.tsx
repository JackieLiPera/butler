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
import { errorMap, signIn } from "../utils";
import { APP_NAME } from "../constants";
import { useNavigation } from "@react-navigation/native";
import SignUpScreen from "./SignUpScreen";

export default function SignInScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
              {isSignUp ? (
                <SignUpScreen />
              ) : (
                <>
                  <Text style={styles.header}>Sign in to {APP_NAME}</Text>

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
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },
  error: {
    color: "red",
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
  back: {
    color: "#000",
    marginVertical: 16,
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
});
