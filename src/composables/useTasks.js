import { ref, watch } from "vue";

export function useTasks(currentUser, selectedSubject) {
  const tasks = ref([]);
  const showTaskModal = ref(false);
  const editingTask = ref(null);

  const saveTask = (taskData) => {
    if (editingTask.value) {
      // Update existing task
      const taskIndex = tasks.value.findIndex(
        (t) => t.id === editingTask.value.id
      );
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = {
          ...tasks.value[taskIndex],
          ...taskData,
        };
      }
    } else {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        status: "todo",
        subjectId: selectedSubject.value.id,
        userId: currentUser.value.id,
      };

      tasks.value.push(newTask);
    }

    saveUserData();
    closeTaskModal();
  };

  const editTask = (task) => {
    editingTask.value = task;
    showTaskModal.value = true;
  };

  const deleteTask = (taskId) => {
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
    saveUserData();
  };

  const closeTaskModal = () => {
    showTaskModal.value = false;
    editingTask.value = null;
  };

  const getTaskCount = (subjectId) => {
    return tasks.value.filter((task) => task.subjectId === subjectId).length;
  };

  const getTasksByStatus = (status) => {
    if (!selectedSubject.value) return [];
    return tasks.value.filter(
      (task) =>
        task.subjectId === selectedSubject.value.id && task.status === status
    );
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

  const saveUserData = () => {
    if (!currentUser.value) return;

    const userData = JSON.parse(
      localStorage.getItem(`taskSchedulerData_${currentUser.value.id}`) || "{}"
    );
    userData.tasks = tasks.value;

    localStorage.setItem(
      `taskSchedulerData_${currentUser.value.id}`,
      JSON.stringify(userData)
    );
  };

  const loadUserData = () => {
    if (!currentUser.value) return;

    const userData = JSON.parse(
      localStorage.getItem(`taskSchedulerData_${currentUser.value.id}`) || "{}"
    );
    tasks.value = userData.tasks || [];
  };

  // Watch for user changes
  watch(
    currentUser,
    (newUser) => {
      if (newUser) {
        loadUserData();
      } else {
        tasks.value = [];
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
  };
}
