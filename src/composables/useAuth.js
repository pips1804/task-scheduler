// src/composables/auth.js

import { ref } from "vue";
import { auth, db, storage } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  ref as firebaseStorageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const isAuthenticated = ref(false);
const currentUser = ref(null);
const loadingAuthState = ref(true); // NEW ✅

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    isAuthenticated.value = true;
    currentUser.value = {
      uid: user.uid,
      displayName: userData.displayName || user.displayName || "User",
      email: user.email,
      photoURL: userData.profileImage || "", // Base64 image
    };
  } else {
    isAuthenticated.value = false;
    currentUser.value = null;
  }

  loadingAuthState.value = false;
});

export const updateUserProfile = async ({ displayName, profileImage }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  // ✅ Update Firestore
  await setDoc(
    doc(db, "users", user.uid),
    {
      displayName,
      profileImage,
    },
    { merge: true }
  );

  // ✅ Also update Firebase Auth (optional, but safe to match both)
  await updateProfile(user, {
    displayName,
    photoURL: "", // We’re not using this, but required by Firebase
  });

  // ✅ Update local `currentUser` immediately so UI reflects changes
  currentUser.value = {
    uid: user.uid,
    displayName,
    email: user.email,
    photoURL: profileImage,
  };
};

export function useAuth() {
  const handleLogin = async (credentials) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = userCred.user;

      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error("Email not verified");
      }
      currentUser.value = {
        uid: user.uid,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "", // <-- this is the actual download URL
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

      await updateProfile(userCred.user, {
        displayName: userData.name,
      });

      // ✅ Reload to ensure updated profile is reflected
      await userCred.user.reload();

      const user = userCred.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: userData.name,
        email: user.email,
        createdAt: new Date(),
      });

      currentUser.value = {
        uid: user.uid,
        name: user.displayName || "", // now this should have the correct value
        email: user.email,
      };

      isAuthenticated.value = false; // still need email verification
      return { user, emailSent: true };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    currentUser.value = null;
    isAuthenticated.value = false;
  };

  const resendEmailVerification = async (user) => {
    await sendEmailVerification(user);
  };

  return {
    isAuthenticated,
    currentUser,
    loadingAuthState, // ✅ expose this
    handleLogin,
    handleSignup,
    logout,
    resendEmailVerification,
    updateUserProfile,
  };
}
