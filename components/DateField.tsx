import { Dispatch, SetStateAction, useState } from "react";
import { View, Platform, Pressable, Text, StyleSheet } from "react-native";
import DatePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

type DateFieldProps = {
  label?: string;
  initialValue: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function DateField({
  initialValue,
  setDate,
  label = "Date",
}: DateFieldProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialValue);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, newDate?: Date) => {
    if (newDate) {
      setSelectedDate(newDate);
      setDate(newDate);
    }
    // Keep open on iOS, close on Android
    setShowPicker(Platform.OS === "ios");
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={selectedDate ? styles.valueText : styles.placeholderText}>
          {selectedDate ? formatDate(selectedDate) : label}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </Pressable>

      {showPicker && (
        <DatePicker
          value={selectedDate || new Date()}
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
  container: {
    marginBottom: 16,
    alignItems: "flex-start",
    width: "100%",
  },
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
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  valueText: {
    color: "#333",
    fontSize: 16,
  },
});
