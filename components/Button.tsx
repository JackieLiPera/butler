import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

export const Button = ({
  text,
  onPress,
  variation,
  disabled = false,
}: {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variation: "filled" | "outlined";
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        variation === "filled" && styles.filled,
        disabled && styles.disabled,
        pressed && { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
      onPress={onPress}
    >
      <Text style={styles[`${variation}ButtonText`]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  outlined: {
    borderColor: "#000",
  },
  filled: {
    backgroundColor: "black",
  },
  outlinedButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  filledButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  disabled: {
    color: "#ccc",
    opacity: 0.3,
  },
});
