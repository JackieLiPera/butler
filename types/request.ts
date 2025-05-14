import { Timestamp } from "firebase/firestore";
import { Profile } from "./profile";

export interface Request {
  acceptedAt?: Date | null;
  acceptedUser?: Profile;
  duration?: number;
  requestText: string;
  createdAt: Timestamp;
  location: {
    latitude: number;
    longitude: number;
  };
  paymentAmount?: number;
  id: string;
  radius: { meters: number };
}
