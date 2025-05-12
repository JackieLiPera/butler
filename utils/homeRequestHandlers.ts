import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Request } from "../types/request";
import { Profile, UserData } from "../types/profile";
import { serializeUser } from "./user";

export const acceptRequest = async (request: Request) => {
  const currentUser = auth.currentUser;

  try {
    await updateDoc(doc(db, "requests", request.id), {
      acceptedBy: currentUser?.uid,
      acceptedAt: Timestamp.now(),
    });
  } catch (e) {
    alert(`There was an error accepting the request: "${request.requestText}"`);
  }
};

export const loadUser = async (): Promise<Profile | null> => {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No authenticated user found");
    throw Error("Please sign in.");
  }

  try {
    const ref = doc(db, "users", user.uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw Error("User does not exist.");
    }

    const data = snapshot.data() as UserData;
    return serializeUser(data, user.uid);
  } catch (error) {
    console.error("Error loading user:", error);
    throw Error("Unable to load user.");
  }
};

export const checkAccountCompleted = (user: DocumentData): string | null => {
  const { phone } = user;
  // TODO identification

  if (!phone) {
    return "Finish setting up your account";
  }

  return null;
};

export const subscribeToRequests = (
  callback: (requests: Request[]) => void
) => {
  const requestsRef = collection(db, "requests");
  const openRequests = query(requestsRef, where("acceptedAt", "==", null));

  return onSnapshot(openRequests, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[];

    callback(requests);
  });
};
