<template>
  <div
    :class="[
      'lg:w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col sidebar',
      show ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:flex',
    ]"
  >
    <!-- Desktop Header -->
    <div
      class="hidden lg:flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <h1
        class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Task Scheduler
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

    <!-- Mobile Close Button -->
    <div
      class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <h2 class="text-xl font-bold">Subjects</h2>
      <button
        @click="$emit('close')"
        class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Subjects -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold hidden lg:block">Subjects</h2>
        <button
          @click="$emit('add-subject')"
          class="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus class="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="subject in subjects"
          :key="subject.id"
          :class="[
            'group p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg',
            selectedSubject?.id === subject.id
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 shadow-md'
              : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800',
          ]"
          @click="$emit('select-subject', subject)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              ></div>
              <span class="font-medium">{{ subject.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="bg-gray-100 dark:bg-gray-700 text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {{ getTaskCount(subject.id) }}
              </span>
              <button
                @click.stop="$emit('delete-subject', subject.id)"
                class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="subjects.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <BookOpen class="w-8 h-8 text-blue-500" />
        </div>
        <h3 class="font-semibold mb-2">No subjects yet</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Create your first subject to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Sun, Moon, LogOut, X, Trash2, BookOpen } from "lucide-vue-next";

defineProps({
  show: Boolean,
  subjects: Array,
  selectedSubject: Object,
  isDarkMode: Boolean,
  getTaskCount: Function,
});

defineEmits([
  "close",
  "toggle-dark-mode",
  "logout",
  "select-subject",
  "add-subject",
  "delete-subject",
]);
</script>
