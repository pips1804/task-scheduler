<template>
  <div
    class="flex-1 flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-gray-900/50 dark:to-gray-800/50"
  >
    <!-- Header -->
    <div
      class="w-full flex justify-center items-center gap-2 sm:gap-3 py-4 sm:py-6 border-b border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm"
    >
      <component
        :is="props.selectedSubject ? BookOpen : Clipboard"
        class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
      />
      <h1
        class="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight"
      >
        {{ props.selectedSubject ? props.selectedSubject.name : "Dashboard" }}
      </h1>
    </div>

    <!-- Main content area -->
    <div v-if="props.selectedSubject" class="flex-1 p-6">
      <!-- Subheader and button -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0"
      >
        <div>
          <p class="text-gray-600 dark:text-gray-400">
            Manage your tasks efficiently
          </p>
        </div>
        <button
          @click="$emit('add-task')"
          class="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus class="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-6">
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline mb-4 transition-all"
        >
          <ChevronDown class="rotate-90 w-4 h-4" />
          Back to Kanban Board
        </button>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks by name..."
          class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white shadow-lg transition mb-2"
        />
        <!-- Search Results Dropdown -->
        <div
          v-if="searchQuery && filteredTasks.length"
          class="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 max-h-[320px] overflow-auto divide-y divide-gray-100 dark:divide-gray-800"
        >
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="flex flex-col sm:flex-row sm:justify-between gap-2 items-start sm:items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <!-- Task Info -->
            <div class="space-y-1">
              <p class="text-base font-medium text-gray-800 dark:text-white">
                {{ task.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ task.deadline ? formatDate(task.deadline) : "N/A" }} -
                {{ task.deadline ? formatTime(task.deadline) : "N/A" }}
              </p>
            </div>

            <!-- Controls -->
            <div
              class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end w-full sm:w-auto"
            >
              <!-- Status Dropdown -->
              <div class="relative w-full sm:w-40">
                <select
                  v-model="selectedStatus"
                  @change="changeStatus(task)"
                  class="appearance-none w-full text-sm px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:outline-none transition"
                >
                  <option disabled value="">
                    {{ getStatusName(task.status) }}
                  </option>
                  <option v-if="task.status !== 'todo'" value="todo">
                    To Do
                  </option>
                  <option
                    v-if="task.status !== 'inprogress'"
                    value="inprogress"
                  >
                    In Progress
                  </option>
                  <option v-if="task.status !== 'completed'" value="completed">
                    Completed
                  </option>
                </select>

                <!-- Custom Chevron Icon -->
                <ChevronDown
                  class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-500 dark:text-gray-300"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  @click="$emit('edit-task', task)"
                  class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Edit
                </button>
                <button
                  @click="$emit('delete-task', task.id)"
                  class="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div
          v-if="searchQuery && !filteredTasks.length"
          class="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-50 p-4 text-center text-gray-500 dark:text-gray-400"
        >
          No tasks found.
        </div>
      </div>

      <!-- Kanban Board (hidden when searching) -->
      <div v-if="!searchQuery" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn
          v-for="column in props.columns"
          :key="column.id"
          :column="column"
          :tasks="
            props.tasks.filter(
              (task) =>
                task.status === column.id &&
                task.subjectId === props.selectedSubject?.id
            )
          "
          @drop="(event) => $emit('drop', event, column.id)"
          @drag-start="(event, task) => $emit('drag-start', event, task)"
          @edit-task="(task) => $emit('edit-task', task)"
          @delete-task="(taskId) => $emit('delete-task', taskId)"
          :isTaskOverdue="props.isTaskOverdue"
          :formatDate="props.formatDate"
          :formatTime="props.formatTime"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center p-6">
      <Dashboard />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Plus, Clipboard, BookOpen, ChevronDown } from "lucide-vue-next";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import KanbanColumn from "./KanbanColumn.vue";
import Dashboard from "./Dashboard.vue";

// Define props with access to values
const props = defineProps({
  selectedSubject: Object,
  tasks: Array,
  columns: Array,
  getTasksByStatus: Function,
  isTaskOverdue: Function,
  formatDate: Function,
  formatTime: Function,
});

// Emits
defineEmits([
  "add-task",
  "show-subject-modal",
  "drop",
  "drag-start",
  "edit-task",
  "delete-task",
]);

// Search functionality
const searchQuery = ref("");

const filteredTasks = computed(() => {
  if (!searchQuery.value.trim()) return [];
  return props.tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Utility to get status name from column ID
const getStatusName = (statusId) => {
  if (!statusId) return "No Status";

  const column = props.columns.find(
    (col) => String(col.id).trim() === String(statusId).trim()
  );

  console.log("  - matched column:", column);
  return column ? column.title : "Unknown";
};

const selectedStatus = ref("");
const changeStatus = async (task) => {
  if (!task.newStatus || task.newStatus === task.status) return;

  try {
    await updateDoc(doc(db, "tasks", task.id), {
      status: task.newStatus,
    });
    task.status = task.newStatus;
    task.newStatus = ""; // Reset dropdown
  } catch (error) {
    console.error("Failed to change status:", error);
  }
};

function clearSearch() {
  searchQuery.value = "";
}
</script>
