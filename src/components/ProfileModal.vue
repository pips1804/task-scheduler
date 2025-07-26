<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        @click="closeModal"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold mb-1">Edit Profile</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Update your name and profile picture
            </p>
          </div>
          <button
            @click="closeModal"
            class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="space-y-6">
          <!-- Name -->
          <div>
            <label
              class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Your name"
              autofocus
            />
          </div>

          <!-- Profile Picture -->
          <div>
            <label
              class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300"
            >
              Profile Picture
            </label>
            <input
              type="file"
              @change="onFileChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div
              class="w-24 h-24 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-md overflow-hidden relative"
            >
              <img
                v-if="preview"
                :src="preview"
                alt="Preview"
                class="w-full h-full object-cover"
              />
              <img
                v-else-if="currentUser?.value?.photoURL"
                :src="currentUser.value.photoURL"
                alt="Current"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500"
              >
                No Image
              </div>
              <div
                v-if="isPreviewLoading"
                class="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>{{ isLoading ? "Saving..." : "Save Changes" }}</span>
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
import { ref, watch, computed, watchEffect } from "vue";
import { X } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

const props = defineProps({
  show: Boolean,
  onClose: Function,
});
const emit = defineEmits(["close", "updated"]);

const { currentUser, updateUserProfile } = useAuth();

const name = ref("");
watchEffect(() => {
  if (props.show && currentUser.value) {
    name.value = currentUser.value.displayName || "";
  }
});

const file = ref(null);
const preview = ref("");
const isLoading = ref(false);

watch(
  () => props.show,
  (val) => {
    if (val && currentUser.value) {
      name.value = currentUser.value.displayName || "";
      preview.value = currentUser.value.photoURL || "";
      base64Image.value = ""; // clear base64 only when opening
    }
    // 🔥 Remove the `else` block entirely
  }
);

const base64Image = ref("");
const isPreviewLoading = ref(false);

const onFileChange = async (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  isPreviewLoading.value = true;

  const reader = new FileReader();
  reader.onload = () => {
    preview.value = reader.result;
    base64Image.value = reader.result;
    isPreviewLoading.value = false;
  };
  reader.readAsDataURL(selectedFile);
};

const submit = async () => {
  try {
    isLoading.value = true;

    await updateUserProfile({
      displayName: name.value,
      profileImage: base64Image.value || currentUser.value?.photoURL || "", // fallback to existing photoURL
    });

    emit("updated");

    setTimeout(() => {
      closeModal();
      isLoading.value = false; // ✅ move here so spinner doesn't disappear early
    }, 500);
  } catch (error) {
    console.error("[submit] Profile update failed:", error);
    isLoading.value = false;
  }
};

const closeModal = () => {
  emit("close");
};
</script>
