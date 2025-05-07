import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Dispatch, SetStateAction } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { v4 as uuidv4 } from "uuid";

export const pickImage = async ({
  setImageUri,
}: {
  setImageUri: Dispatch<SetStateAction<string | null>>;
}) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    alert("Permission to access media library is required.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: true,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return;
  }

  setImageUri(result.assets[0].uri);
};

export const submit = async ({
  requestText,
  radiusMeters,
  payment,
  imageUri,
}: {
  requestText: string;
  radiusMeters: number;
  payment: string;
  imageUri: string | null;
}) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access location was denied");
    return;
  }

  if (!requestText.trim()) {
    alert("Please enter a request.");
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  let imageUrl: string | null = null;

  if (imageUri) {
    try {
      imageUrl = await uploadImageAsync(imageUri);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
      return;
    }
  }

  const requestData = {
    requestText,
    radius: {
      meters: radiusMeters,
    },
    paymentAmount: payment ? parseInt(payment, 10) : null,
    location: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    imageUrl,
    createdAt: Timestamp.now(),
  };

  try {
    await addDoc(collection(db, "requests"), requestData);
    alert("Request submitted!");
  } catch (error) {
    console.error("Error adding document:", error);
    alert("Something went wrong. Please try again.");
  }
};

export const uploadImageAsync = async (uri: string): Promise<string> => {
  const response = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const blob = await fetch(`data:image/jpeg;base64,${response}`).then((res) =>
    res.blob()
  );

  const filename = `requests/${uuidv4()}.jpg`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
};
