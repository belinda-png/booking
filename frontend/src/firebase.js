// src/firebase.js

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAKpt6hFqAlTS4knU7v1jrjUaBNPs76KRU",
  authDomain: "booking-612fd.firebaseapp.com",
  projectId: "booking-612fd",
  storageBucket: "booking-612fd.firebasestorage.app",
  messagingSenderId: "912421559864",
  appId: "1:912421559864:web:8eabb1092a92418f2d10cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;