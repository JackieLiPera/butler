import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { RootStackParamList } from "../types/navigation";
import { checkUsernameAvailability, signUp } from "../utils";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DateField from "../components/DateField";
import { APP_NAME } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { validatePassword } from "../utils";

const fieldsMapper: Record<number, Set<string>> = {
  1: new Set(["email", "username"]),
  2: new Set(["firstName", "lastName", "birthday"]),
  3: new Set([]),
};

export default function SignUpScreen() {
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

    setStep(step + 1);
  }, [email, username, firstName, lastName, birthday]);

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
    <View style={styles.container}>
      <Text style={styles.header}>Create your {APP_NAME} account</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={(text) => {
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
          <View>
            <TextInput
              style={styles.input}
              placeholder="Username *"
              value={username}
              onChangeText={setUsername}
              onBlur={() => {
                if (!username.trim()) {
                  setError("Username is required.");
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
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
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
          <DateField
            label="Birthday *"
            // @ts-expect-error we dont allow setting null for birthday except for initial value
            setDate={setBirthday}
            initialValue={birthday}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            }
          />
          <Text style={styles.helperText}>
            You must be 18 years or older to use {APP_NAME}
          </Text>
        </>
      )}

      {step === 3 && (
        <>
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
              const passwordError = validatePassword(password);
              if (passwordError) {
                setError(passwordError);
              }
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
            onBlur={() => {
              if (!confirmPassword) {
                setError("Please confirm your password.");
              }
              if (confirmPassword !== password) {
                setError("Passwords must match.");
              }
            }}
          />
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.nav}>
        {step > 1 && (
          <Pressable onPress={() => setStep(step - 1)}>
            <Text style={styles.navButton}>← Back</Text>
          </Pressable>
        )}
        {step < 3 ? (
          <Pressable onPress={handleNext}>
            <Text style={styles.navButton}>Next →</Text>
          </Pressable>
        ) : (
          <Pressable
            style={() => [Boolean(error) && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={Boolean(error)}
          >
            <Text style={styles.navButton}>Create Account</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  error: {
    color: "red",
    marginTop: 24,
  },
  usernameAvailable: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
  },
  helperText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
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
  buttonDisabled: {
    color: "#ccc",
    opacity: 0.3,
  },
});
