import { Timestamp } from "firebase/firestore";

export interface Request {
  requestText: string;
  createdAt: Timestamp;
  location: {
    latitude: number;
    longitude: number;
  };
  paymentAmount?: number;
  id: string;
  radiusMeters: number;
}
