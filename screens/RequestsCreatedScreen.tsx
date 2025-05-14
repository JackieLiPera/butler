import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { BottomNav } from "../components";
import type { RootStackParamList, Request } from "../types";

type RequestsCreatedRouteProp = RouteProp<
  RootStackParamList,
  "RequestsCreated"
>;

const OptionItem = ({
  label,
  description,
  onPress,
  showArrow = false,
}: {
  label: string;
  description?: string;
  onPress: () => void;
  showArrow?: boolean;
}) => (
  <Pressable onPress={onPress} style={styles.option}>
    <View style={styles.label}>
      <Text style={styles.labelText}>{label}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
    {showArrow && <Ionicons name="chevron-forward" size={20} color="#999" />}
  </Pressable>
);

const Section = ({
  title,
  requests,
  isCompleted = false,
  isInProgress = false,
}: {
  title: string;
  requests: Request[];
  isCompleted?: boolean;
  isInProgress?: boolean;
}) => {
  if (!requests.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {requests.map((req) => {
        const timestamp = isCompleted
          ? req.completedAt?.toDate?.()
          : req.createdAt?.toDate?.();
        const formatted = timestamp
          ? format(timestamp, "MMM dd, yyyy - h:mm a")
          : "Unknown date";

        return (
          <OptionItem
            key={req.id}
            label={formatted}
            description={req.requestText}
            showArrow={isInProgress}
            onPress={() => {
              if (isInProgress) {
                // Navigate to detailed request screen in future
                console.log("Navigate to request detail:", req.id);
              }
            }}
          />
        );
      })}
    </View>
  );
};

export default function RequestsCreatedScreen() {
  const route = useRoute<RequestsCreatedRouteProp>();
  const navigation = useNavigation();
  const { requests, user } = route.params;

  const acceptedRequests = requests.filter(
    (req) => req.acceptedAt && !req.completedAt
  );
  const openRequests = requests.filter(
    (req) => !req.acceptedAt && !req.completedAt
  );
  const completedRequests = requests.filter((req) => req.completedAt);

  return (
    <View style={styles.container}>
      {requests.length ? (
        <ScrollView>
          <Section
            title="Accepted"
            requests={acceptedRequests}
            isInProgress={true}
          />
          <Section title="Open" requests={openRequests} />
          <Section title="Completed" requests={completedRequests} isCompleted />
        </ScrollView>
      ) : (
        <Text style={styles.empty}>No created requests found.</Text>
      )}
      <BottomNav user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  section: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    flex: 1,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  empty: {
    color: "#777",
    fontStyle: "italic",
    padding: 16,
  },
});
