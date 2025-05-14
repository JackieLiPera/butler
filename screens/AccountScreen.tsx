import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomNav } from "../components";
import type { RootStackParamList } from "../types";

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

type Route = RouteProp<RootStackParamList, "Account">;

export default function AccountScreen() {
  const route = useRoute<Route>();
  const { user } = route.params;
  const [account, setAccount] = useState<any>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setAccount(snapshot.data());
        }
      }
    };

    loadData();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      navigation.navigate("SignIn");
    } catch (e) {
      throw Error(`There was an issue logging out: ${e}`);
    }
  }, [auth]);

  const items: {
    label: string;
    description?: string;
    route?: keyof RootStackParamList;
    onPress?: Function;
    routeProps?: any;
  }[] = [
    { label: "Manage Account", route: "ManageAccount", routeProps: { user } },
    { label: "Request History", route: "History", routeProps: { user } },
    { label: "Settings", route: "Settings", routeProps: { user } },
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
        <Text style={styles.username}>
          {account?.username || "Your Account"}
        </Text>
      </View>
      {items.map(({ label, description, route, onPress, routeProps }) => (
        <OptionItem
          key={label}
          label={label}
          description={description}
          onPress={() => {
            if (onPress) {
              onPress();
            } else if (route) {
              navigation.navigate(route, routeProps);
            }
          }}
        />
      ))}
      <BottomNav user={user} />
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
