import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMHL1QvEusDY6fXP-gXjc7pW01YCu2VDk",
  authDomain: "butler-050525.firebaseapp.com",
  projectId: "butler-050525",
  storageBucket: "butler-050525.firebasestorage.app",
  messagingSenderId: "684962793084",
  appId: "1:684962793084:web:9bef0636e820efd7352bf9",
  measurementId: "G-02NQ32TTRL",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
