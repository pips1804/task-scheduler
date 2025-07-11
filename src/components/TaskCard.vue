<template>
  <div
    :class="[
      'group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border cursor-move transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      isOverdue
        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
        : 'border-gray-200 dark:border-gray-700',
    ]"
    draggable="true"
    @dragstart="(event) => $emit('drag-start', event)"
  >
    <div class="flex items-start justify-between mb-3">
      <h4 class="font-semibold text-gray-900 dark:text-white leading-tight">
        {{ task.name }}
      </h4>
      <div
        class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <button
          @click="$emit('edit', task)"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Edit class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <p
      v-if="task.description"
      class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed"
    >
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
        <Calendar class="w-4 h-4" />
        <span>{{ formatDate(task.deadline) }}</span>
      </div>
      <div class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
        <Clock class="w-4 h-4" />
        <span>{{ formatTime(task.deadline) }}</span>
      </div>
    </div>

    <div v-if="isOverdue" class="mt-3 flex items-center space-x-2">
      <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span class="text-xs text-red-600 dark:text-red-400 font-medium"
        >Overdue</span
      >
    </div>
  </div>
</template>

<script setup>
import { Edit, Trash2, Calendar, Clock } from "lucide-vue-next";

defineProps({
  task: Object,
  isOverdue: Boolean,
  formatDate: Function,
  formatTime: Function,
});

defineEmits(["drag-start", "edit", "delete"]);
</script>
