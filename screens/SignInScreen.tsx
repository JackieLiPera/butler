import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { RootStackParamList } from "../types/navigation";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/config";

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

export default function SignInScreen({
  navigation,
}: {
  navigation: SignInScreenNavigationProp;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignIn = async () => {
    try {
      // await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (err: any) {
      setError(err.message);
    }
  };
  console.log("HELLO WORLD");

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
}
