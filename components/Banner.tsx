import { ReactNode } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
} from "react-native";

type BannerType = "error" | "warning" | "success";

export const Banner = ({
  text,
  type,
  callback,
  children,
}: {
  text: string;
  type: BannerType;
  callback?: (event: GestureResponderEvent) => void;
  children?: ReactNode;
}) => {
  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={styles.bannerText}>{text}</Text>
      {children && (
        <Pressable style={styles.link} onPress={callback}>
          {children}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  error: {
    backgroundColor: "#ffe5e5",
    borderLeftColor: "#e57373",
  },
  warning: {
    backgroundColor: "#fff8dc",
    borderLeftColor: "#ffcc00",
  },
  success: {
    backgroundColor: "#f0fdf4",
  },
  bannerText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  linkText: {
    fontWeight: "700",
    color: "#000",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
