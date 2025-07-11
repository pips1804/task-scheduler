<template>
  <div
    class="flex-1 flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-gray-900/50 dark:to-gray-800/50"
  >
    <div v-if="selectedSubject" class="flex-1 p-6">
      <!-- Subject Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0"
      >
        <div>
          <h2 class="text-3xl font-bold mb-2">{{ selectedSubject.name }}</h2>
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

      <!-- Kanban Board -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn
          v-for="column in columns"
          :key="column.id"
          :column="column"
          :tasks="getTasksByStatus(column.id)"
          @drop="(event) => $emit('drop', event, column.id)"
          @drag-start="(event, task) => $emit('drag-start', event, task)"
          @edit-task="(task) => $emit('edit-task', task)"
          @delete-task="(taskId) => $emit('delete-task', taskId)"
          :isTaskOverdue="isTaskOverdue"
          :formatDate="formatDate"
          :formatTime="formatTime"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center p-6">
      <div class="text-center max-w-md">
        <div
          class="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6"
        >
          <Clipboard class="w-12 h-12 text-blue-500" />
        </div>
        <h3 class="text-2xl font-bold mb-3">No Subject Selected</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Select a subject from the sidebar to view and manage your tasks
        </p>
        <button
          @click="$emit('show-subject-modal')"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Create Your First Subject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Clipboard } from "lucide-vue-next";
import KanbanColumn from "./KanbanColumn.vue";

defineProps({
  selectedSubject: Object,
  tasks: Array,
  columns: Array,
  getTasksByStatus: Function,
  isTaskOverdue: Function,
  formatDate: Function,
  formatTime: Function,
});

defineEmits([
  "add-task",
  "show-subject-modal",
  "drop",
  "drag-start",
  "edit-task",
  "delete-task",
]);
</script>
