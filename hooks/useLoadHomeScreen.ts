import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { checkAccountCompleted, loadUser, subscribeToRequests } from "../utils";
import type { Profile, Request } from "../types";

export const useLoadHomeScreen = () => {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string>("");
  const [warning, setWarning] = useState<string>("");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    if (user) {
      const message = checkAccountCompleted(user);

      if (message) {
        setWarning(message);
      }
    }

    if (location && requests.length > 0) {
      setReady(true);
    }
  }, [user, location, requests]);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    };

    const getUser = async () => {
      try {
        const user = await loadUser();
        setUser(user);
      } catch (e: unknown) {
        // @ts-expect-error
        setBanner(e.message);
      }
    };

    getLocation();
    getUser();

    const unsubscribe = subscribeToRequests(setRequests);
    return () => unsubscribe();
  }, []);

  return {
    ready,
    error,
    warning,
    data: {
      user,
      location,
      requests,
    },
  };
};
