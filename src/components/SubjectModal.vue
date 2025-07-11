<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        @click="closeModal"
      ></div>
      <div
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold mb-1">Add Subject</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Create a new subject to organize your tasks
            </p>
          </div>
          <button
            @click="closeModal"
            class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label
              class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300"
              >Subject Name</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Mathematics, Science, History"
              autofocus
            />
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Create Subject
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  name: "",
});

const submit = () => {
  if (form.name.trim()) {
    emit("submit", { name: form.name.trim() });
    form.name = "";
  }
};

const closeModal = () => {
  emit("close");
  form.name = "";
};

// Reset form when modal closes
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      form.name = "";
    }
  }
);
</script>
