import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export const BottomNav = () => {
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
        onPress={() => navigation.navigate("Profile")}
        style={styles.button}
      >
        <Ionicons
          name={isActive("Profile") ? "person" : "person-outline"}
          size={28}
          color={isActive("Profile") ? "#000" : "#999"}
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
    paddingVertical: 24,
    paddingHorizontal: 48,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
