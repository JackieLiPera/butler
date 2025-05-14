import type { Profile } from "./profile";
import type { Request } from "./request";

export type RootStackParamList = {
  Account: { user: Profile | null };
  CreateRequest: undefined;
  History: { user: Profile | null };
  Home: {
    toast?: { type: "success" | "error"; text1: string; text2?: string };
  };
  ManageAccount: { user: Profile | null };
  PrivacyPolicy: undefined;
  RequestsAccepted: { requests: Request[]; user: Profile | null };
  RequestsCreated: { requests: Request[]; user: Profile | null };
  Settings: { user: Profile | null };
  SignIn: undefined;
};
