// src/composables/useTheme.js
"use client";

import { ref, watch } from "vue";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export function useTheme(currentUser) {
  const isDarkMode = ref(false);

  const loadTheme = async () => {
    if (currentUser.value) {
      const userDocRef = doc(db, "users", currentUser.value.id);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        isDarkMode.value = userData.isDarkMode ?? false;
      }
    } else {
      // Fallback: use localStorage if no user
      const saved = localStorage.getItem("taskSchedulerDarkMode");
      isDarkMode.value = saved === "true";
    }
  };

  const saveTheme = async (value) => {
    if (currentUser.value) {
      const userDocRef = doc(db, "users", currentUser.value.id);
      await setDoc(userDocRef, { isDarkMode: value }, { merge: true });
    } else {
      localStorage.setItem("taskSchedulerDarkMode", value.toString());
    }
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    saveTheme(isDarkMode.value);
  };

  // Watch user for changes and load theme accordingly
  watch(
    currentUser,
    (newUser) => {
      loadTheme();
    },
    { immediate: true }
  );

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
