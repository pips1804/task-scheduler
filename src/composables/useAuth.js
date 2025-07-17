// src/composables/auth.js

"use client";

import { ref } from "vue";
import { auth, db } from "../firebase/firebase"; // ✅ make sure db is imported
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // ✅ Firestore methods for writing data

const isAuthenticated = ref(false);
const currentUser = ref(null);

// Check auth state on composable load
onAuthStateChanged(auth, (user) => {
  if (user) {
    isAuthenticated.value = true;
    currentUser.value = {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
    };
  } else {
    isAuthenticated.value = false;
    currentUser.value = null;
  }
});

export function useAuth() {
  const handleLogin = async (credentials) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = userCred.user;
      currentUser.value = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
      };
      isAuthenticated.value = true;
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSignup = async (userData) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Set Firebase displayName
      await updateProfile(userCred.user, {
        displayName: userData.name,
      });

      const user = userCred.user;

      // Save to Firestore users collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: userData.name,
        email: user.email,
        createdAt: new Date(),
      });

      currentUser.value = {
        uid: user.uid,
        name: userData.name,
        email: user.email,
      };
      isAuthenticated.value = true;

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    currentUser.value = null;
    isAuthenticated.value = false;
  };

  return {
    isAuthenticated,
    currentUser,
    handleLogin,
    handleSignup,
    logout,
  };
}
