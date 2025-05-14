import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { toastConfig } from "./toastConfig";

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </>
  );
}
