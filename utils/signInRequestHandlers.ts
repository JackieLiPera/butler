import * as ImagePicker from "expo-image-picker";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc, Timestamp } from "firebase/firestore";
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

export const signUp = async ({
  firstName,
  lastName,
  username,
  birthday,
  email,
  password,
}: Profile) => {
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

    console.log("Signed up:", user.uid);
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
