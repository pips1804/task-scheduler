// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBpuh-3KtmQd912JCdJNRb8DNZEB8KKAJQ",
  authDomain: "task-scheduler-cae18.firebaseapp.com",
  projectId: "task-scheduler-cae18",
  storageBucket: "task-scheduler-cae18.firebasestorage.app",
  messagingSenderId: "1050180671528",
  appId: "1:1050180671528:web:62af957259d520f875bd1d",
  measurementId: "G-7PY5K9PW66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// ✅ Export them
export { auth, db, storage };
