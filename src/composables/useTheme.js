// src/composables/useTheme.js
"use client";

import { ref, watch } from "vue";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useTheme(currentUser) {
  // Validate that currentUser is a ref
  if (!currentUser || typeof currentUser.value === "undefined") {
    throw new Error(
      "❌ useTheme requires a ref as currentUser (e.g. ref(null))"
    );
  }

  const isDarkMode = ref(false);

  const loadTheme = async () => {
    try {
      if (currentUser.value && currentUser.value.id) {
        const userDocRef = doc(db, "users", currentUser.value.id);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          isDarkMode.value = userData.isDarkMode ?? false;
        } else {
          isDarkMode.value = false;
        }
      } else {
        const saved = localStorage.getItem("taskSchedulerDarkMode");
        isDarkMode.value = saved === "true";
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const saveTheme = async (value) => {
    try {
      if (currentUser.value && currentUser.value.id) {
        const userDocRef = doc(db, "users", currentUser.value.id);
        await setDoc(userDocRef, { isDarkMode: value }, { merge: true });
      } else {
        localStorage.setItem("taskSchedulerDarkMode", value.toString());
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    saveTheme(isDarkMode.value);
  };

  // Automatically watch for currentUser changes
  watch(
    currentUser,
    async () => {
      await loadTheme();
    },
    { immediate: true }
  );

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
