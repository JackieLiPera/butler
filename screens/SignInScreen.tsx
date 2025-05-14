import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { errorMap, signIn } from "../utils";
import { APP_NAME } from "../constants";
import { useNavigation } from "@react-navigation/native";
import SignUpScreen from "./SignUpScreen";
import { HeaderText, Button, InputText, ErrorText } from "../components";
import type { RootStackParamList } from "../types";

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
              <Button
                variation="outlined"
                text={"Sign In"}
                onPress={() => setIsSignUp(false)}
              />
              <Button
                variation="outlined"
                text={"Sign Up"}
                onPress={() => setIsSignUp(true)}
              />
            </>
          ) : (
            <>
              {isSignUp ? (
                <SignUpScreen setIsSignUp={setIsSignUp} />
              ) : (
                <>
                  <HeaderText>Sign in to {APP_NAME}</HeaderText>
                  <InputText
                    placeholder="Email *"
                    value={email}
                    onChange={(text) => {
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
                  <InputText
                    placeholder="Password *"
                    value={password}
                    secureTextEntry
                    onChange={setPassword}
                    onBlur={() => {
                      if (!password.trim()) {
                        setError("Password is required.");
                      }
                    }}
                  />

                  {error ? <ErrorText>{error}</ErrorText> : null}
                  <Button
                    onPress={handleSignIn}
                    text="Sign In"
                    disabled={!email || !password || Boolean(error)}
                    variation="outlined"
                  />
                  <Pressable
                    onPress={() => {
                      setIsSignUp(null);
                      setEmail("");
                      setPassword("");
                      setError("");
                    }}
                  >
                    <Text style={styles.navButton}>← Back</Text>
                  </Pressable>
                </>
              )}
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
    padding: 24,
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 48,
    alignSelf: "center",
  },
  navButton: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
});
