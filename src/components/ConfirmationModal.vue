<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        @click="$emit('cancel')"
      ></div>
      <div
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
      >
        <!-- Icon -->
        <div
          class="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full"
          :class="iconBgClass"
        >
          <component :is="iconComponent" :class="iconClass" class="w-8 h-8" />
        </div>

        <!-- Content -->
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold mb-3">{{ title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            :class="confirmButtonClass"
            class="flex-1 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { AlertTriangle, Trash2, LogOut, Info } from "lucide-vue-next";

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: "Confirm",
  },
  confirmType: {
    type: String,
    default: "danger",
    validator: (value) => ["danger", "warning", "info"].includes(value),
  },
});

defineEmits(["confirm", "cancel"]);

const iconComponent = computed(() => {
  switch (props.confirmType) {
    case "danger":
      return props.title.includes("Delete") ? Trash2 : AlertTriangle;
    case "warning":
      return LogOut;
    case "info":
      return Info;
    default:
      return AlertTriangle;
  }
});

const iconBgClass = computed(() => {
  switch (props.confirmType) {
    case "danger":
      return "bg-red-100 dark:bg-red-900/30";
    case "warning":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "info":
      return "bg-blue-100 dark:bg-blue-900/30";
    default:
      return "bg-red-100 dark:bg-red-900/30";
  }
});

const iconClass = computed(() => {
  switch (props.confirmType) {
    case "danger":
      return "text-red-600 dark:text-red-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    case "info":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-red-600 dark:text-red-400";
  }
});

const confirmButtonClass = computed(() => {
  switch (props.confirmType) {
    case "danger":
      return "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white";
    case "warning":
      return "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white";
    case "info":
      return "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white";
    default:
      return "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white";
  }
});
</script>
