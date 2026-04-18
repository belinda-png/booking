// firebase.js

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore" // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)

// ✅ Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// ✅ Firestore (THIS FIXES YOUR ERROR)
export const db = getFirestore(app)