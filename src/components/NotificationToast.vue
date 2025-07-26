<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div
        v-if="show"
        class="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 w-auto max-w-sm mx-auto sm:mx-0"
      >
        <div
          :class="toastClass"
          class="rounded-2xl p-4 shadow-2xl border backdrop-blur-sm"
        >
          <div class="flex items-start space-x-3">
            <!-- Icon -->
            <div
              :class="iconBgClass"
              class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <component
                :is="iconComponent"
                :class="iconClass"
                class="w-5 h-5"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              @click="$emit('close')"
              class="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X class="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div
            class="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              :class="progressBarClass"
              class="h-full rounded-full transition-all duration-75 ease-linear animate-progress"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-vue-next";

const props = defineProps({
  show: Boolean,
  type: {
    type: String,
    default: "success",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
  title: String,
  message: String,
  duration: {
    type: Number,
    default: 4000,
  },
});

const emit = defineEmits(["close"]);

const iconComponent = computed(() => {
  switch (props.type) {
    case "success":
      return CheckCircle;
    case "error":
      return XCircle;
    case "warning":
      return AlertCircle;
    case "info":
      return Info;
    default:
      return CheckCircle;
  }
});

const toastClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    case "error":
      return "bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    case "warning":
      return "bg-yellow-50/90 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    case "info":
      return "bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    default:
      return "bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800";
  }
});

const iconBgClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-100 dark:bg-green-800/30";
    case "error":
      return "bg-red-100 dark:bg-red-800/30";
    case "warning":
      return "bg-yellow-100 dark:bg-yellow-800/30";
    case "info":
      return "bg-blue-100 dark:bg-blue-800/30";
    default:
      return "bg-green-100 dark:bg-green-800/30";
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case "success":
      return "text-green-600 dark:text-green-400";
    case "error":
      return "text-red-600 dark:text-red-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    case "info":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-green-600 dark:text-green-400";
  }
});

const progressBarClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-500";
    default:
      return "bg-green-500";
  }
});

// Auto close after duration
onMounted(() => {
  if (props.show && props.duration > 0) {
    setTimeout(() => {
      emit("close");
    }, props.duration);
  }
});
</script>

<style scoped>
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progress 4s linear forwards;
}
</style>
