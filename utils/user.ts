import { Timestamp } from "firebase/firestore";
import { UserData, Profile } from "../types/profile";

export const serializeUser = (user: UserData, uid: string): Profile => {
  return {
    ...user,
    uid,
    birthday:
      user.birthday instanceof Timestamp
        ? user.birthday.toDate()
        : user.birthday,
  };
};

export const deserializeUser = (user: any): any => {
  return {
    ...user,
    birthday:
      user.birthday instanceof Date
        ? Timestamp.fromDate(user.birthday)
        : typeof user.birthday === "string"
        ? Timestamp.fromDate(new Date(user.birthday))
        : user.birthday,
  };
};
