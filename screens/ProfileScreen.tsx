import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const OptionItem = ({
  label,
  description,
  onPress,
}: {
  label: string;
  description?: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.option}>
    <Text style={styles.optionText}>{label}</Text>
    <Text>{description}</Text>
    {label !== "Log Out" && (
      <Ionicons name="chevron-forward" size={20} color="#999" />
    )}
  </Pressable>
);

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setProfile(snapshot.data());
        }
      }
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.navigate("SignIn");
  };

  const items: {
    label: string;
    description?: string;
    route?: keyof RootStackParamList;
    onPress?: Function;
  }[] = [
    { label: "Manage Account", route: "Account" },
    { label: "Request History", route: "History" },
    { label: "Notification Settings", route: "Settings" },
    { label: "Privacy Policy", route: "PrivacyPolicy" },
    { label: "Log Out", onPress: handleLogout },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={32}
          color="#333"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.username}>{profile?.username || "Account"}</Text>
      </View>
      {items.map(({ label, description, route }) => (
        <OptionItem
          key={label}
          label={label}
          description={description}
          onPress={() => navigation.navigate(route!)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  username: {
    fontSize: 28,
    fontWeight: "700",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
});
