import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

export const HeaderText = ({ children }: { children: ReactNode }) => {
  return <Text style={styles.header}>{children}</Text>;
};

export const HelperText = ({ children }: { children: ReactNode }) => {
  return <Text style={styles.helper}>{children}</Text>;
};

export const ErrorText = ({ children }: { children: ReactNode }) => {
  return <Text style={styles.error}>{children}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    alignSelf: "center",
  },
  helper: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
