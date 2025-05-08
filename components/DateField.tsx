import { useState } from "react";
import { View, Platform, Pressable, Text, StyleSheet } from "react-native";
import DatePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function DateField({ setDate }: any) {
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios"); // keep open on iOS, close on Android
    if (selectedDate) {
      setBirthday(selectedDate);
      setDate?.(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={birthday ? styles.valueText : styles.placeholderText}>
          {birthday ? birthday.toISOString().split("T")[0] : "Birthday *"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </Pressable>

      {showPicker && (
        <DatePicker
          value={birthday || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, alignItems: "flex-start" },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  valueText: {
    color: "#999",
    fontSize: 16,
  },
});
