import { Timestamp } from "firebase/firestore";

export interface UserData {
  createdAt?: Timestamp;
  firstName: string;
  lastName: string;
  username: string;
  birthday: Timestamp;
  email: string;
  password: string;
  phone?: string;
}

export interface Profile extends Omit<UserData, "birthday" | "createdAt"> {
  birthday: Date;
  uid: string;
}
