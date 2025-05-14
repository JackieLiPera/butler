import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { checkUsernameAvailability, signUp } from "../utils";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { APP_NAME } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { validatePassword } from "../utils";
import {
  HeaderText,
  HelperText,
  DateField,
  InputText,
  ErrorText,
  OutlinedButton,
} from "../components";
import type { RootStackParamList } from "../types";

const fieldsMapper: Record<number, Set<string>> = {
  1: new Set(["email", "username"]),
  2: new Set(["firstName", "lastName", "birthday"]),
  3: new Set([]),
};

export default function SignUpScreen({
  setIsSignUp,
}: {
  setIsSignUp: Dispatch<SetStateAction<boolean | null>>;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [step, setStep] = useState<number>(1);

  const handleNext = useCallback(() => {
    const fieldsToValidate = fieldsMapper[step];
    if (fieldsToValidate.has("email") && !email) {
      setError("Enter your email.");
      return;
    }
    if (fieldsToValidate.has("username") && !username) {
      setError("Enter a username.");
      return;
    }
    if (fieldsToValidate.has("firstName") && !firstName) {
      setError("Enter your first name.");
      return;
    }
    if (fieldsToValidate.has("lastName") && !lastName) {
      setError("Enter your last name.");
      return;
    }
    if (fieldsToValidate.has("birthday") && !birthday) {
      setError("Enter your birthday.");
      return;
    }

    if (step < 1 || step > 3) {
      console.error("Step out of range");
    }

    setStep(step + 1);
  }, [email, username, firstName, lastName, birthday]);

  const handleBack = () => {
    if (step > 3) {
      console.error("Step out of range");
    }
    setError("");
    if (step === 1) {
      setUsername("");
      setEmail("");
      setIsSignUp(null);
    } else {
      setStep(step - 1);
    }
  };

  const handleCheckUsernameAvailability = useCallback(
    async (value: string) => {
      const isAvailable = await checkUsernameAvailability(value);

      if (isAvailable) {
        setError("");
        setUsernameAvailable(true);
      } else {
        setError("Username is not available. Try again.");
      }
    },
    [setUsername]
  );

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

    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    if (birthday > eighteenYearsAgo) {
      setError("You must be at least 18 years old to sign up.");
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

  return (
    <>
      <HeaderText>Create your {APP_NAME} account</HeaderText>

      {step === 1 && (
        <>
          <InputText
            placeholder="Enter your email"
            value={email}
            onChange={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            keyboardType="email-address"
            onBlur={() => {
              const trimmed = email.trim();
              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

              if (!trimmed) {
                setError("Email is required.");
              } else if (!isValidEmail) {
                setError("Please enter a valid email address.");
              }
            }}
          />

          <>
            <InputText
              placeholder="Create a username for your account"
              value={username}
              onChange={setUsername}
              onBlur={() => {
                if (!username.trim()) {
                  setError("Username is required.");
                  return;
                }
                if (username.length < 4) {
                  setError("Username must be more than 4 characters.");
                  return;
                }

                handleCheckUsernameAvailability(username);
              }}
            />
            {usernameAvailable && (
              <View style={styles.usernameAvailable}>
                <Ionicons name="checkmark-circle" size={20} color="green" />
                <Text style={{ marginLeft: 4 }}>{username} is available!</Text>
              </View>
            )}
          </>
        </>
      )}

      {step === 2 && (
        <>
          <InputText
            placeholder="Enter your first name *"
            value={firstName}
            onChange={setFirstName}
            onBlur={() => {
              if (!firstName.trim()) {
                setError("First name is required.");
              } else {
                setError("");
              }
            }}
          />
          <InputText
            placeholder="Enter your last name *"
            value={lastName}
            onChange={setLastName}
            onBlur={() => {
              if (!lastName.trim()) {
                setError("Last name is required.");
              } else {
                setError("");
              }
            }}
          />
          <View style={{ marginBottom: 16 }}>
            <DateField
              label="Enter your birthday *"
              // @ts-expect-error we dont allow setting null for birthday except for initial value
              setDate={setBirthday}
              initialValue={birthday}
              maxDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              }
            />
            <HelperText>
              You must be 18 years or older to use {APP_NAME}
            </HelperText>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <InputText
            placeholder="Password *"
            value={password}
            secureTextEntry
            onChange={setPassword}
            onBlur={() => {
              if (!password) {
                setError("Password is required.");
              }
              const passwordError = validatePassword(password);
              if (passwordError) {
                setError(passwordError);
              }
            }}
          />
          <InputText
            placeholder="Confirm Password *"
            value={confirmPassword}
            secureTextEntry
            onChange={setConfirmPassword}
            onBlur={() => {
              if (!confirmPassword) {
                setError("Please confirm your password.");
              }
              if (confirmPassword !== password) {
                setError("Passwords must match.");
              }
            }}
          />

          <HelperText>
            Passwords must be 8 characters or more. Must have at least one
            capital letter, one special character and one number.
          </HelperText>
        </>
      )}

      {error ? <ErrorText>{error}</ErrorText> : null}

      <View style={styles.nav}>
        <Pressable onPress={handleBack}>
          <Text style={styles.navButton}>← Back</Text>
        </Pressable>
        {step < 3 && (
          <Pressable onPress={handleNext}>
            <Text style={styles.navButton}>Next →</Text>
          </Pressable>
        )}
      </View>
      {step === 3 && (
        <OutlinedButton
          onPress={handleSignUp}
          text="Create Account"
          disabled={Boolean(error)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  nav: {
    marginVertical: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  usernameAvailable: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
  },
});
