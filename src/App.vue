<template>
  <div
    :class="{ dark: isDarkMode }"
    class="min-h-screen transition-all duration-300"
  >
    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white"
    >
      <!-- Authentication Page -->
      <AuthPage
        v-if="!isAuthenticated"
        :isDarkMode="isDarkMode"
        @login="handleLogin"
        @signup="handleSignup"
        @toggle-dark-mode="toggleDarkMode"
      />

      <!-- Main App -->
      <div v-else class="flex flex-col lg:flex-row min-h-screen">
        <!-- Mobile Header -->
        <MobileHeader
          :isDarkMode="isDarkMode"
          @toggle-sidebar="showMobileSidebar = !showMobileSidebar"
          @toggle-dark-mode="toggleDarkMode"
          @logout="logout"
        />

        <!-- Sidebar -->
        <Sidebar
          :show="showMobileSidebar"
          :subjects="subjects"
          :selectedSubject="selectedSubject"
          :isDarkMode="isDarkMode"
          @close="showMobileSidebar = false"
          @toggle-dark-mode="toggleDarkMode"
          @logout="logout"
          @select-subject="selectSubject"
          @add-subject="showSubjectModal = true"
          @delete-subject="confirmDeleteSubject"
          @select-dashboard="selectedSubject = null"
          :getTaskCount="getTaskCount"
        />

        <!-- Main Content -->
        <MainContent
          :selectedSubject="selectedSubject"
          :tasks="tasks"
          :columns="columns"
          @add-task="showTaskModal = true"
          @edit-task="editTask"
          @delete-task="confirmDeleteTask"
          @drag-start="onDragStart"
          @drop="onDrop"
          :getTasksByStatus="getTasksByStatus"
          :isTaskOverdue="isTaskOverdue"
          :formatDate="formatDate"
          :formatTime="formatTime"
          @show-subject-modal="showSubjectModal = true"
        />
      </div>

      <!-- Modern Modals -->
      <SubjectModal
        :show="showSubjectModal"
        @close="showSubjectModal = false"
        @submit="addSubject"
      />

      <TaskModal
        :show="showTaskModal"
        :editingTask="editingTask"
        @close="closeTaskModal"
        @submit="saveTask"
      />

      <!-- Confirmation Modal -->
      <ConfirmationModal
        +
        :show="showConfirmModal"
        :title="confirmModal.title"
        :message="confirmModal.message"
        :confirmText="confirmModal.confirmText"
        :confirmType="confirmModal.type"
        @confirm="handleConfirm"
        @cancel="cancelConfirm"
      />

      <!-- Notification Toast -->
      <NotificationToast
        :show="showNotification"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        @close="hideNotification"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AuthPage from "./components/AuthPage.vue";
import MobileHeader from "./components/MobileHeader.vue";
import Sidebar from "./components/Sidebar.vue";
import MainContent from "./components/MainContent.vue";
import SubjectModal from "./components/SubjectModal.vue";
import TaskModal from "./components/TaskModal.vue";
import ConfirmationModal from "./components/ConfirmationModal.vue";
import NotificationToast from "./components/NotificationToast.vue";
import { useAuth } from "./composables/useAuth";
import { useSubjects } from "./composables/useSubjects";
import { useTasks } from "./composables/useTasks";
import { useTheme } from "./composables/useTheme";
import { useKanban } from "./composables/useKanban";
import { useNotifications } from "./composables/useNotifications";

// Composables
const {
  isAuthenticated,
  currentUser,
  handleLogin: authLogin,
  handleSignup: authSignup,
  logout: authLogout,
} = useAuth();

const { isDarkMode, toggleDarkMode } = useTheme(currentUser);

const {
  subjects,
  showSubjectModal,
  selectedSubject,
  addSubject: addSubjectAction,
  selectSubject,
  deleteSubject: deleteSubjectAction,
} = useSubjects(currentUser);

const {
  tasks,
  showTaskModal,
  editingTask,
  saveTask: saveTaskAction,
  editTask,
  deleteTask: deleteTaskAction,
  closeTaskModal,
  getTaskCount,
  getTasksByStatus,
  isTaskOverdue,
  formatDate,
  formatTime,
} = useTasks(currentUser, selectedSubject);

const { columns, onDragStart, onDrop } = useKanban(tasks);

const {
  showNotification,
  notification,
  showSuccess,
  showError,
  showInfo,
  hideNotification,
} = useNotifications();

// Confirmation Modal State
const showConfirmModal = ref(false);
const confirmModal = ref({
  title: "",
  message: "",
  confirmText: "Confirm",
  type: "danger",
  action: null,
});

// UI state
const showMobileSidebar = ref(false);

// Enhanced Methods with Notifications
const handleLogin = async (credentials) => {
  try {
    await authLogin(credentials);
    showSuccess("Welcome to StopCrammin'!", "You have successfully logged in.");
  } catch (error) {
    showError("Login Failed", error.message || "Invalid credentials.");
  }
};

const saveTask = async (taskData) => {
  const isNew = !editingTask.value; // more reliable

  try {
    await saveTaskAction(taskData);

    showSuccess(
      isNew ? "Task Added" : "Task Updated",
      isNew
        ? `"${taskData.name}" has been added to your board.`
        : `"${taskData.name}" has been updated.`
    );
  } catch (error) {
    showError("Save Failed", error.message || "Could not save task.");
  }
};

// const handleSignup = async (userData) => {
//   try {
//     const { user, emailSent } = await authSignup(userData);

//     if (emailSent) {
//       showSuccess(
//         "Account Created!",
//         "Please check your email to verify your account before logging in."
//       );
//     } else {
//       showSuccess(
//         "Account Created!",
//         "Welcome to StopCrammin'. Start organizing your tasks!"
//       );
//     }
//   } catch (error) {
//     showError(
//       "Signup Failed",
//       error.message || "Unable to create account. Please try again."
//     );
//   }
// };

const addSubject = (subjectData) => {
  addSubjectAction(subjectData);
  showSuccess(
    "Subject Created!",
    `"${subjectData.name}" has been added to your subjects.`
  );
};

const confirmDeleteSubject = (subjectId) => {
  const subject = subjects.value.find((s) => s.id === subjectId);
  const taskCount = getTaskCount(subjectId);

  confirmModal.value = {
    title: "Delete Subject",
    message: `Are you sure you want to delete "${subject?.name}"? ${
      taskCount > 0
        ? `This will also delete ${taskCount} task${taskCount > 1 ? "s" : ""}.`
        : ""
    } This action cannot be undone.`,
    confirmText: "Delete Subject",
    type: "danger",
    action: () => {
      deleteSubjectAction(subjectId);
      showSuccess(
        "Subject Deleted",
        `"${subject?.name}" and all its tasks have been removed.`
      );
    },
  };
  showConfirmModal.value = true;
};

const confirmDeleteTask = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId);

  confirmModal.value = {
    title: "Delete Task",
    message: `Are you sure you want to delete "${task?.name}"? This action cannot be undone.`,
    confirmText: "Delete Task",
    type: "danger",
    action: () => {
      deleteTaskAction(taskId);
      showSuccess("Task Deleted", `"${task?.name}" has been removed.`);
    },
  };
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  if (confirmModal.value.action) {
    confirmModal.value.action();
  }
  showConfirmModal.value = false;
};

const cancelConfirm = () => {
  showConfirmModal.value = false;
};

const logout = () => {
  confirmModal.value = {
    title: "Sign Out",
    message:
      "Are you sure you want to sign out? Any unsaved changes will be preserved.",
    confirmText: "Sign Out",
    type: "warning",
    action: () => {
      authLogout();
      showMobileSidebar.value = false;
      showInfo("Signed Out", "You have been successfully signed out.");
    },
  };
  showConfirmModal.value = true;
};

// Close mobile sidebar when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (
      showMobileSidebar.value &&
      !e.target.closest(".sidebar") &&
      !e.target.closest(".mobile-header")
    ) {
      showMobileSidebar.value = false;
    }
  });
});
</script>
