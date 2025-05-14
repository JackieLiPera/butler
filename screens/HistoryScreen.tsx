import { View, Text, StyleSheet, Pressable } from "react-native";
import { Banner, BottomNav, HeaderText } from "../components";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useLoadHistoryScreen } from "../hooks/useLoadHistoryScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Route = RouteProp<RootStackParamList, "History">;

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
    <View style={styles.label}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </Pressable>
);

export default function HistoryScreen() {
  const route = useRoute<Route>();
  const { user } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { error, data } = useLoadHistoryScreen();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="chatbox-outline"
          size={32}
          color="#333"
          style={{ marginRight: 8 }}
        />
        <HeaderText>Your Requests</HeaderText>
      </View>
      <OptionItem
        label="Created Requests"
        description="View and track progress of requests you've created."
        onPress={() => {
          navigation.navigate("RequestsCreated", {
            requests: data.createdRequests,
            user,
          });
        }}
      />
      <OptionItem
        label="Accepted Requests"
        description="View and update the progress of requests you've accepted."
        onPress={() => {
          navigation.navigate("RequestsAccepted", {
            requests: data.acceptedRequests,
            user,
          });
        }}
      />

      {error && <Banner text={error} type="error" />}
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
    alignItems: "flex-start",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    display: "flex",
    flexDirection: "column",
  },
  labelText: {
    fontSize: 16,
    paddingBottom: 8,
  },
  description: {
    fontSize: 12,
  },
});
