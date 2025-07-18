// src/composables/useSubjects.js
import { ref, watch } from "vue";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useSubjects(currentUser) {
  const subjects = ref([]);
  const selectedSubject = ref(null);
  const showSubjectModal = ref(false);
  const unsubscribeRef = ref(null);

  const loadUserSubjects = async () => {
    if (!currentUser.value || !currentUser.value.uid) {
      console.warn("No user found, skipping subject load.");
      return;
    }

    const q = query(
      collection(db, "subjects"),
      where("userId", "==", currentUser.value.uid) // ✅ fixed
    );

    if (unsubscribeRef.value) {
      unsubscribeRef.value();
    }

    unsubscribeRef.value = onSnapshot(q, (querySnapshot) => {
      console.log("Subjects snapshot triggered.");
      const result = [];
      querySnapshot.forEach((docSnap) => {
        result.push({ id: docSnap.id, ...docSnap.data() });
      });
      subjects.value = result;

      //   if (result.length > 0 && !selectedSubject.value) {
      //     selectedSubject.value = result[0];
      //   }
    });
  };

  const addSubject = async (subjectData) => {
    if (!currentUser.value || !currentUser.value.uid) {
      console.error("User not logged in or UID missing");
      return;
    }

    const docRef = await addDoc(collection(db, "subjects"), {
      name: subjectData.name,
      userId: currentUser.value.uid, // ✅ fixed
    });

    console.log("Subject added with ID:", docRef.id);

    subjects.value.push({
      id: docRef.id,
      name: subjectData.name,
      userId: currentUser.value.uid,
    });

    selectedSubject.value = {
      id: docRef.id,
      name: subjectData.name,
      userId: currentUser.value.uid,
    };

    showSubjectModal.value = false;

    setTimeout(() => {
      loadUserSubjects();
    }, 500);
  };

  const deleteSubject = async (subjectId) => {
    await deleteDoc(doc(db, "subjects", subjectId));

    if (selectedSubject.value?.id === subjectId) {
      selectedSubject.value =
        subjects.value.find((s) => s.id !== subjectId) || null;
    }

    subjects.value = subjects.value.filter((s) => s.id !== subjectId);
  };

  const selectSubject = (subject) => {
    selectedSubject.value = subject;
  };

  watch(
    currentUser,
    (newUser) => {
      if (newUser && newUser.uid) {
        console.log("User logged in, loading subjects...");
        loadUserSubjects();
      } else {
        console.log("User logged out or no UID, clearing subjects.");
        if (unsubscribeRef.value) unsubscribeRef.value();
        subjects.value = [];
        selectedSubject.value = null;
      }
    },
    { immediate: true }
  );

  return {
    subjects,
    selectedSubject,
    showSubjectModal,
    addSubject,
    deleteSubject,
    selectSubject,
    loadUserSubjects,
  };
}
