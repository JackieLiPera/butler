import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Request } from "../types/request";

export const acceptRequest = async (request: Request) => {
  const currentUser = auth.currentUser;

  try {
    await updateDoc(doc(db, "requests", request.id), {
      acceptedBy: currentUser?.uid,
      acceptedAt: Timestamp.now(),
    });
  } catch (e) {
    alert(`There was an error accepting the request: "${request.requestText}"`);

    console.log(e);
  }
};
