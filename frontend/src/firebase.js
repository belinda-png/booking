import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAKpt6hFqAlTS4knU7v1jrjUaBNPs76KRU",
  authDomain: "booking-612fd.firebaseapp.com",
  projectId: "booking-612fd",
  storageBucket: "booking-612fd.appspot.com",
  messagingSenderId: "912421559864",
  appId: "1:912421559864:web:8eabb1092a92418f2d10cd"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// ✅ EXPORT THESE (VERY IMPORTANT)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)