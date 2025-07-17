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
      <span class="text-xs text-red-600 dark:text-red-400 font-medium">
        Overdue
      </span>
    </div>

    <!-- Move to Status Dropdown -->
    <div class="relative mt-4">
      <select
        class="w-full text-sm p-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none appearance-none"
        v-model="selectedStatus"
        @change="changeStatus"
      >
        <option disabled value="">Move to...</option>
        <option v-if="task.status !== 'todo'" value="todo">To Do</option>
        <option v-if="task.status !== 'inprogress'" value="inprogress">
          In Progress
        </option>
        <option v-if="task.status !== 'completed'" value="completed">
          Completed
        </option>
      </select>

      <!-- Lucide ChevronDown icon, positioned slightly to the left -->
      <ChevronDown
        class="absolute pointer-events-none right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-300"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Edit, Trash2, Calendar, Clock, ChevronDown } from "lucide-vue-next";

const props = defineProps({
  task: Object,
  isOverdue: Boolean,
  formatDate: Function,
  formatTime: Function,
});

defineEmits(["drag-start", "edit", "delete"]);

const selectedStatus = ref("");

// Method to update task status
const changeStatus = async () => {
  if (!selectedStatus.value || selectedStatus.value === props.task.status)
    return;
  const taskRef = doc(db, "tasks", props.task.id);
  await updateDoc(taskRef, { status: selectedStatus.value });
  selectedStatus.value = ""; // Reset after change
};
</script>
