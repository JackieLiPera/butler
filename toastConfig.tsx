import {
  BaseToast,
  ErrorToast,
  type BaseToastProps,
} from "react-native-toast-message";

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#f0fdf4", backgroundColor: "#f0fdf4" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#256029",
      }}
      text2Style={{
        fontSize: 14,
        color: "#256029",
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#fdecea", backgroundColor: "#fdecea" }}
      text1Style={{ color: "#b71c1c" }}
      text2Style={{ color: "#b71c1c" }}
    />
  ),
};
