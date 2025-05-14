import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Profile } from "../types";

export const BottomNav = ({ user }: { user: Profile | null }) => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const isActive = (screen: string) => route.name === screen;

  return (
    <View style={styles.footer}>
      <Pressable
        onPress={() => navigation.navigate("Home")}
        style={styles.button}
      >
        <Ionicons
          name={isActive("Home") ? "home" : "home-outline"}
          size={28}
          color={isActive("Home") ? "#000" : "#999"}
        />
        <Text>Home</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("History", { user })}
        style={styles.button}
      >
        <Ionicons
          name={isActive("History") ? "chatbox" : "chatbox-outline"}
          size={28}
          color={isActive("History") ? "#000" : "#999"}
        />
        <Text>Requests</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("Account", { user })}
        style={styles.button}
      >
        <Ionicons
          name={isActive("Account") ? "person" : "person-outline"}
          size={28}
          color={isActive("Account") ? "#000" : "#999"}
        />
        <Text>Account</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 48,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
});
