import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import SignInScreen from "../screens/SignInScreen";
import CreateRequestScreen from "../screens/CreateRequestScreen";
import AccountScreen from "../screens/AccountScreen";
import { auth } from "../firebase/config";
import ManageAccountScreen from "../screens/ManageAccountScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={auth.currentUser ? "Home" : "SignIn"}>
        {/* <Stack.Navigator initialRouteName={"Home"}> */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="ManageAccount" component={ManageAccountScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
