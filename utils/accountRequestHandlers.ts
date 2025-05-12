import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { deserializeUser } from "./user";

export const updateProfile = async (
  {
    firstName,
    lastName,
    birthday,
    phone,
  }: {
    firstName: string;
    lastName: string;
    birthday: Date;
    phone: string;
  },
  uid: string
) => {
  const ref = doc(db, "users", uid);

  const data = deserializeUser({
    firstName,
    lastName,
    birthday,
    phone,
  });

  try {
    await updateDoc(ref, data);
  } catch (e) {
    throw Error(`Could not update profile: ${e}`);
  }
};
