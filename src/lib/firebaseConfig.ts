import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage

const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: "recepiewebsite-be26b",
  storageBucket: " ",
  messagingSenderId: "857402846259",
  appId: "1:857402846259:web:904613f0959f1da3fc4746",
  measurementId: "G-D2QYYJP1WW",
};

// ✅ Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add Firebase Storage

export { auth, db, storage }; // ✅ Export everything
