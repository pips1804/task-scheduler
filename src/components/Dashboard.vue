<!-- DashboardStats.vue -->
<template>
  <div class="px-4 py-8 max-w-screen-xl mx-auto">
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard title="Subjects" :count="subjects.length" color="blue" />
      <StatCard
        title="To Do"
        :count="getTasksByStatus('todo').length"
        color="gray"
      />
      <StatCard
        title="In Progress"
        :count="getTasksByStatus('inprogress').length"
        color="yellow"
      />
      <StatCard
        title="Completed"
        :count="getTasksByStatus('completed').length"
        color="green"
      />

      <!-- Centered on mobile: col-span-2 and justify-self-center -->
      <div
        class="col-span-2 justify-self-center lg:col-span-1 lg:justify-self-auto"
      >
        <StatCard title="Overdue" :count="overdueTasks.length" color="red" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "../composables/useAuth";
import { useSubjects } from "../composables/useSubjects";
import { useTasks } from "../composables/useTasks";
import StatCard from "./StatCard.vue";

const { currentUser } = useAuth();
const { subjects } = useSubjects(currentUser);
const { tasks, getTasksByStatus, isTaskOverdue } = useTasks(currentUser, null);

const overdueTasks = computed(() =>
  tasks.value.filter((t) => isTaskOverdue(t))
);
</script>
