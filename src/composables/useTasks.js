import { ref, watch } from "vue";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useTasks(currentUser, selectedSubject) {
  const tasks = ref([]);
  const showTaskModal = ref(false);
  const editingTask = ref(null);
  const unsubscribeRef = ref(null);
  const showTaskErrorModal = ref(false);

  const loadTasks = async () => {
    if (!currentUser.value) return;

    const taskQuery = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.value.uid)
    );

    if (unsubscribeRef.value) unsubscribeRef.value();

    unsubscribeRef.value = onSnapshot(taskQuery, (snapshot) => {
      const result = [];
      snapshot.forEach((docSnap) => {
        const task = { id: docSnap.id, ...docSnap.data() };
        result.push(task);
      });
      tasks.value = result;
    });
  };

  const saveTask = async (taskData) => {
    if (!currentUser.value || !selectedSubject.value) return;

    try {
      if (editingTask.value) {
        const taskRef = doc(db, "tasks", editingTask.value.id);
        await updateDoc(taskRef, {
          ...taskData,
        });
      } else {
        await addDoc(collection(db, "tasks"), {
          ...taskData,
          status: "todo",
          subjectId: selectedSubject.value.id,
          userId: currentUser.value.uid,
        });
      }

      closeTaskModal();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const editTask = (task) => {
    editingTask.value = task;
    showTaskModal.value = true;
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const closeTaskModal = () => {
    showTaskModal.value = false;
    editingTask.value = null;
  };

  const getTaskCount = (subjectId) => {
    if (!subjectId) return 0;
    return tasks.value.filter((t) => t.subjectId === subjectId).length;
  };

  const getTasksByStatus = (status) => {
    if (!selectedSubject?.value) return [];
    return tasks.value.filter((t) => t.status === status);
  };

  const isTaskOverdue = (task) => {
    return new Date(task.deadline) < new Date() && task.status !== "completed";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const moveTaskToStatus = async (taskId, newStatus) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      status: newStatus,
    });
  };

  // Watch for changes in user or selected subject
  watch(
    [currentUser, selectedSubject],
    ([user, subject]) => {
      if (user) {
        loadTasks();
      } else {
        tasks.value = [];
        if (unsubscribeRef.value) unsubscribeRef.value();
      }
    },
    { immediate: true }
  );

  return {
    tasks,
    showTaskModal,
    editingTask,
    saveTask,
    editTask,
    deleteTask,
    closeTaskModal,
    getTaskCount,
    getTasksByStatus,
    isTaskOverdue,
    formatDate,
    formatTime,
    moveTaskToStatus,
    showTaskErrorModal,
  };
}
