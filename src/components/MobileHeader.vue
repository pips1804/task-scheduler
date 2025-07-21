<template>
  <div
    class="lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex items-center justify-between mobile-header sticky top-0 z-40"
  >
    <button
      @click="$emit('toggle-sidebar')"
      class="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
    >
      <Menu class="w-5 h-5" />
    </button>
    <h1
      class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
    >
      StopCrammin'
    </h1>
    <div class="flex items-center space-x-2">
      <button
        @click="$emit('toggle-dark-mode')"
        class="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <Sun v-if="isDarkMode" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
      </button>
      <button
        @click="$emit('logout')"
        class="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <LogOut class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Menu, Sun, Moon, LogOut } from "lucide-vue-next";

defineProps({
  isDarkMode: Boolean,
});

defineEmits(["toggle-sidebar", "toggle-dark-mode", "logout"]);
</script>
