import { Profile } from "./profile";

export type RootStackParamList = {
  CreateRequest: undefined;
  History: undefined;
  Home: undefined;
  Account: { user: Profile | null };
  PrivacyPolicy: undefined;
  Profile: undefined;
  Settings: undefined;
  SignIn: undefined;
};
