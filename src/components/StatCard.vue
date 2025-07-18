<template>
  <div
    class="p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full"
  >
    <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">
      {{ title }}
    </p>
    <h2 :class="textColorClass">
      {{ count }}
    </h2>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  count: Number,
  color: {
    type: String,
    default: "gray",
  },
});

// Map colors to specific Tailwind classes
const colorClasses = {
  blue: "text-blue-600 dark:text-blue-400",
  gray: "text-gray-600 dark:text-gray-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  green: "text-green-600 dark:text-green-400",
  red: "text-red-600 dark:text-red-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  pink: "text-pink-600 dark:text-pink-400",
  purple: "text-purple-600 dark:text-purple-400",
};

const textColorClass = computed(() => {
  return `text-3xl sm:text-4xl font-extrabold ${
    colorClasses[props.color] || colorClasses.gray
  }`;
});
</script>
