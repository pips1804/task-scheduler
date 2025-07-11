<template>
  <div
    class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div
          :class="[
            'w-3 h-3 rounded-full',
            column.id === 'todo'
              ? 'bg-gray-400'
              : column.id === 'inprogress'
              ? 'bg-blue-500'
              : 'bg-green-500',
          ]"
        ></div>
        <h3 class="font-semibold text-lg">{{ column.title }}</h3>
        <span
          class="bg-gray-100 dark:bg-gray-700 text-sm px-3 py-1 rounded-full font-medium"
        >
          {{ tasks.length }}
        </span>
      </div>
      <component :is="column.icon" class="w-5 h-5 text-gray-400" />
    </div>

    <div
      class="space-y-4 min-h-[300px]"
      @drop="onDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :isOverdue="isTaskOverdue(task)"
        @drag-start="(event) => $emit('drag-start', event, task)"
        @edit="(task) => $emit('edit-task', task)"
        @delete="(taskId) => $emit('delete-task', taskId)"
        :formatDate="formatDate"
        :formatTime="formatTime"
      />

      <!-- Empty State -->
      <div v-if="tasks.length === 0" class="text-center py-12">
        <div
          class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3"
        >
          <component :is="column.icon" class="w-6 h-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          No {{ column.title.toLowerCase() }} tasks
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskCard from "./TaskCard.vue";

defineProps({
  column: Object,
  tasks: Array,
  isTaskOverdue: Function,
  formatDate: Function,
  formatTime: Function,
});

const emit = defineEmits(["drop", "drag-start", "edit-task", "delete-task"]);

const onDrop = (event) => {
  emit("drop", event);
};
</script>
