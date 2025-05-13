import { Timestamp } from "firebase/firestore";

export interface Request {
  acceptedAt?: Date | null;
  acceptedBy?: string;
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
