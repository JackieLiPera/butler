import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

export const OutlinedButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}) => {
  return (
    <Pressable style={styles.outlinedButton} onPress={onPress}>
      <Text style={styles.outlinedButtonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
});
