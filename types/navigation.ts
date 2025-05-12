import { Profile } from "./profile";

export type RootStackParamList = {
  CreateRequest: undefined;
  History: undefined;
  Home: undefined;
  ManageAccount: { user: Profile | null };
  PrivacyPolicy: undefined;
  Account: { user: Profile | null };
  Settings: { user: Profile | null };
  SignIn: undefined;
};
