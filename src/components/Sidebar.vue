<template>
  <div
    :class="[
      'lg:w-85 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col sidebar transition-all duration-300',
      show ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:flex',
    ]"
  >
    <!-- Desktop Header -->
    <div
      class="hidden lg:flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <h1
        class="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight"
      >
        StopCrammin'
      </h1>
      <div class="flex items-center gap-2 ml-4">
        <button
          @click="$emit('toggle-dark-mode')"
          class="p-2.5 rounded-xl hover:bg-gray-200/60 dark:hover:bg-gray-800 transition"
        >
          <Sun v-if="isDarkMode" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>

        <button
          @click="$emit('logout')"
          class="p-2.5 rounded-xl hover:bg-gray-200/60 dark:hover:bg-gray-800 transition"
        >
          <LogOut class="w-5 h-5" />
        </button>

        <button
          @click="$emit('open-profile')"
          class="p-2.5 rounded-xl hover:bg-gray-200/60 dark:hover:bg-gray-800 transition ml-1"
        >
          <img
            :src="currentUser?.photoURL || defaultProfileImage"
            alt="Profile"
            class="w-7 h-7 rounded-full object-cover"
          />
        </button>
      </div>
    </div>

    <!-- <div
      class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-300 dark:border-gray-700"
    >
      <div class="flex flex-col">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Welcome back,
        </p>
        <h2
          class="text-2xl font-bold text-gray-800 dark:text-white tracking-tight"
        >
          {{ currentUser.name }}
        </h2>
      </div>
    </div> -->

    <!-- Mobile Header -->
    <div
      class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <h2 class="text-xl font-bold">Options</h2>
      <button
        @click="$emit('close')"
        class="p-2 rounded-xl hover:bg-gray-200/60 dark:hover:bg-gray-800 transition"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Subjects -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Overview
        </h2>
        <div
          class="mt-3 group p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-md"
          :class="[
            selectedSubject === null
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 shadow'
              : 'bg-white/60 dark:bg-gray-800/60 border-gray-200/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80',
          ]"
          @click="$emit('select-dashboard')"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-teal-500 shadow-sm"
            ></div>
            <span class="font-medium text-gray-800 dark:text-gray-100">
              Dashboard
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Subjects
        </h2>
        <button
          @click="$emit('add-subject')"
          class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
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
            'group p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-md',
            selectedSubject?.id === subject.id
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 shadow'
              : 'bg-white/60 dark:bg-gray-800/60 border-gray-200/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80',
          ]"
          @click="$emit('select-subject', subject)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm"
              ></div>
              <span class="font-medium text-gray-800 dark:text-gray-100">{{
                subject.name
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="bg-gray-100 dark:bg-gray-700 text-xs px-2.5 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300"
              >
                {{ getTaskCount(subject.id) }}
              </span>
              <button
                @click.stop="$emit('delete-subject', subject.id)"
                class="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
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
        <h3 class="font-semibold text-gray-800 dark:text-white mb-2">
          No subjects yet
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Create your first subject to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Sun, Moon, LogOut, X, Trash2, BookOpen } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth"; // adjust path if needed

const { currentUser } = useAuth();

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
  "open-profile",
]);
</script>
