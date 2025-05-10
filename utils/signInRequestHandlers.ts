import * as ImagePicker from "expo-image-picker";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { auth, db } from "../firebase/config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { Profile } from "../types/profile";

export const pickLicenseImage = async (
  setLicenseUri: Dispatch<SetStateAction<string | null>>
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled && result.assets?.length) {
    setLicenseUri(result.assets[0].uri);
  }
};

export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  try {
    const snapshot = await getDocs(q);
    const isAvailable = snapshot.empty;

    return isAvailable;
  } catch (e) {
    return false;
  }
};

export const signUp = async ({
  firstName,
  lastName,
  username,
  birthday,
  email,
  password,
}: Omit<Profile, "uid">) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      username,
      birthday,
      email,
      createdAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw Error(error.message || "Something went wrong. Please try again.");
  }
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw Error(error.message || "Something went wrong. Please try again.");
  }
};
