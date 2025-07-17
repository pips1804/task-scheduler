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
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-white shadow-md"
        />

        <!-- Search Results Dropdown -->
        <div
          v-if="searchQuery && filteredTasks.length"
          class="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-50 max-h-[300px] overflow-auto"
        >
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="flex justify-between items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div>
              <p class="font-semibold text-gray-800 dark:text-white">
                {{ task.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ getStatusName(task.status) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ task.date ? formatDate(task.date) : "N/A" }} -
                {{ task.time ? formatTime(task.time) : "N/A" }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="$emit('edit-task', task)"
                class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                @click="$emit('delete-task', task.id)"
                class="text-red-600 dark:text-red-400 hover:underline text-sm"
              >
                Delete
              </button>
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
          :tasks="props.getTasksByStatus(column.id)"
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
import { Plus, Clipboard, BookOpen } from "lucide-vue-next";
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
  const column = props.columns.find((col) => col.id === statusId);
  return column ? column.name : "Unknown";
};
</script>
