import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type { Request } from "../types";

export const useLoadHistoryScreen = () => {
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
  const [createdRequests, setCreatedRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadRequests = async () => {
      if (!auth.currentUser) {
        setError("You are not logged in.");
        return;
      }

      try {
        const uid = auth.currentUser.uid;

        const createdRequestsQuery = query(
          collection(db, "requests"),
          where("requesterUid", "==", uid),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const acceptedRequestsQuery = query(
          collection(db, "requests"),
          where("acceptedUser.uid", "==", uid),
          orderBy("acceptedAt", "desc"),
          limit(20)
        );

        const createdSnapshot = await getDocs(createdRequestsQuery);

        const createdRequestData = createdSnapshot.docs.map((doc) => ({
          ...(doc.data() as DocumentData),
          id: doc.id,
        })) as Request[];

        const acceptedSnapshot = await getDocs(acceptedRequestsQuery);

        const acceptedRequestsData = acceptedSnapshot.docs.map((doc) => ({
          ...(doc.data() as DocumentData),
          id: doc.id,
        })) as Request[];

        setCreatedRequests(createdRequestData);
        setAcceptedRequests(acceptedRequestsData);
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    loadRequests();
  }, []);

  return {
    error,
    data: {
      acceptedRequests,
      createdRequests,
    },
  };
};
