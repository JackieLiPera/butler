import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
} from "react-native";

export const InputText = ({
  onChange,
  onBlur,
  value,
  placeholder,
  keyboardType,
  secureTextEntry,
}: {
  onChange: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  value: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}) => {
  return (
    <TextInput
      keyboardType={keyboardType}
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
});
