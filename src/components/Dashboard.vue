<template>
  <div class="px-4 py-8 max-w-screen-xl mx-auto">
    <!-- Header Section -->
    <div class="mb-6">
      <h1
        class="text-xl sm:text-3xl font-semibold text-gray-800 dark:text-white break-words"
      >
        {{ greeting }},
        <span
          class="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {{ currentUser?.displayName || "User" }}!
        </span>
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Today is {{ today }}
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Subjects"
        :count="subjects?.length || 0"
        color="blue"
        class="hover:scale-105 transition-transform duration-200"
      />
      <StatCard
        title="To Do"
        :count="getTasksByStatus('todo')?.length || 0"
        color="gray"
        class="hover:scale-105 transition-transform duration-200"
      />
      <StatCard
        title="In Progress"
        :count="getTasksByStatus('inprogress')?.length || 0"
        color="yellow"
        class="hover:scale-105 transition-transform duration-200"
      />
      <StatCard
        title="Completed"
        :count="getTasksByStatus('completed')?.length || 0"
        color="green"
        class="hover:scale-105 transition-transform duration-200"
      />
      <div
        class="col-span-2 justify-self-center lg:col-span-1 lg:justify-self-auto"
      >
        <StatCard
          title="Overdue"
          :count="overdueTasks?.length || 0"
          color="red"
          class="hover:scale-105 transition-transform duration-200"
        />
      </div>
    </div>

    <div class="mt-8 text-center h-16 sm:h-20 md:h-24">
      <transition name="fade" mode="out-in">
        <p
          :key="currentQuote"
          class="text-base sm:text-md md:text-lg lg:text-xl italic text-gray-600 dark:text-gray-300 px-2 sm:px-4"
        >
          "{{ currentQuote }}"
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuth } from "../composables/useAuth";
import { useSubjects } from "../composables/useSubjects";
import { useTasks } from "../composables/useTasks";
import StatCard from "./StatCard.vue";

const { currentUser } = useAuth();
const { subjects } = useSubjects(currentUser);

const selectedSubject = ref(null);

watch(subjects, (newSubjects) => {
  if (!selectedSubject.value && newSubjects.length > 0) {
    selectedSubject.value = newSubjects[0];
  }
});

const { tasks, getTasksByStatus, isTaskOverdue } = useTasks(
  currentUser,
  selectedSubject
);

const overdueTasks = computed(
  () => tasks.value?.filter((t) => isTaskOverdue(t)) || []
);

const today = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const recentTasks = computed(() => tasks.value?.slice(0, 5) || []);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
});

const motivationalQuotes = ref([
  "Believe you can and you're halfway there.",
  "Stay positive, work hard, make it happen.",
  "Success is not for the lazy.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Don't stop until you're proud.",
  "You are capable of amazing things.",
  "Your only limit is your mind.",
]);

const currentQuote = ref(motivationalQuotes.value[0]);
let quoteIndex = 0;

onMounted(() => {
  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % motivationalQuotes.value.length;
    currentQuote.value = motivationalQuotes.value[quoteIndex];
  }, 8000); // Change quote every 8 seconds
});
</script>

<style scoped>
:host {
  background: linear-gradient(to bottom right, #f9fafb, #f1f5f9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
