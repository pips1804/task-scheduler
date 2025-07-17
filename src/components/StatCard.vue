<template>
  <div
    class="p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full"
  >
    <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">
      {{ title }}
    </p>
    <h2
      :class="`text-3xl sm:text-4xl font-extrabold text-${color}-600 dark:text-${color}-400`"
    >
      {{ count }}
    </h2>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  count: Number,
  color: {
    type: String,
    default: "gray",
  },
});
</script>
