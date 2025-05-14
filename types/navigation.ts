import { Profile } from "./profile";

export type RootStackParamList = {
  CreateRequest: undefined;
  History: undefined;
  Home: {
    toast?: { type: "success" | "error"; text1: string; text2?: string };
  };
  ManageAccount: { user: Profile | null };
  PrivacyPolicy: undefined;
  Account: { user: Profile | null };
  Settings: { user: Profile | null };
  SignIn: undefined;
};
