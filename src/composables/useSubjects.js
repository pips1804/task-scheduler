import { ref, watch } from "vue";

export function useSubjects(currentUser) {
  const subjects = ref([]);
  const selectedSubject = ref(null);
  const showSubjectModal = ref(false);

  const addSubject = (subjectData) => {
    const newSubject = {
      id: Date.now().toString(),
      name: subjectData.name,
      userId: currentUser.value.id,
    };

    subjects.value.push(newSubject);
    saveUserData();
    showSubjectModal.value = false;

    if (!selectedSubject.value) {
      selectedSubject.value = newSubject;
    }
  };

  const selectSubject = (subject) => {
    selectedSubject.value = subject;
  };

  const deleteSubject = (subjectId) => {
    subjects.value = subjects.value.filter((s) => s.id !== subjectId);

    if (selectedSubject.value?.id === subjectId) {
      selectedSubject.value = subjects.value[0] || null;
    }

    saveUserData();
  };

  const saveUserData = () => {
    if (!currentUser.value) return;

    const userData = JSON.parse(
      localStorage.getItem(`taskSchedulerData_${currentUser.value.id}`) || "{}"
    );
    userData.subjects = subjects.value;

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

    subjects.value = userData.subjects || [];

    if (subjects.value.length > 0 && !selectedSubject.value) {
      selectedSubject.value = subjects.value[0];
    }
  };

  // Watch for user changes
  watch(
    currentUser,
    (newUser) => {
      if (newUser) {
        loadUserData();
      } else {
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
    selectSubject,
    deleteSubject,
  };
}
