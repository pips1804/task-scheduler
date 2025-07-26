// src/composables/useNotes.js
import { ref, watch } from "vue";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useNotes(currentUser) {
  const notes = ref([]);
  const unsubscribeRef = ref(null);

  const loadNotes = () => {
    if (!currentUser.value?.uid) {
      notes.value = [];
      return;
    }

    const q = query(
      collection(db, "notes"),
      where("userId", "==", currentUser.value.uid)
    );

    if (unsubscribeRef.value) unsubscribeRef.value();

    unsubscribeRef.value = onSnapshot(q, (querySnapshot) => {
      const result = [];
      querySnapshot.forEach((docSnap) => {
        result.push({ id: docSnap.id, ...docSnap.data() });
      });
      notes.value = result;
    });
  };

  const addNote = async () => {
    await addDoc(collection(db, "notes"), {
      title: "",
      content: "",
      tags: [],
      color: "",
      userId: currentUser.value.uid,
      createdAt: serverTimestamp(),
    });
  };

  const updateNote = async (note) => {
    if (!note.id) return;
    await updateDoc(doc(db, "notes", note.id), {
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      color: note.color || "",
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNote = async (noteId) => {
    await deleteDoc(doc(db, "notes", noteId));
  };

  watch(
    currentUser,
    (user) => {
      if (user?.uid) {
        loadNotes();
      } else {
        if (unsubscribeRef.value) unsubscribeRef.value();
        notes.value = [];
      }
    },
    { immediate: true }
  );

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
