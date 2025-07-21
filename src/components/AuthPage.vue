<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(0, 0, 0, 0.15) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        "
      ></div>
    </div>

    <!-- Dark Mode Toggle -->
    <button
      @click="$emit('toggle-dark-mode')"
      class="absolute top-6 right-6 p-3 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
    >
      <Sun v-if="isDarkMode" class="w-5 h-5" />
      <Moon v-else class="w-5 h-5" />
    </button>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo & Title -->
      <div class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
        >
          <CheckSquare class="w-8 h-8 text-white" />
        </div>
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
        >
          StopCrammin'
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Organize your tasks with style
        </p>
      </div>

      <!-- Auth Buttons -->
      <div class="space-y-4">
        <button
          @click="showLoginModal = true"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Sign In
        </button>
        <button
          @click="showSignupModal = true"
          class="w-full bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 py-4 px-6 rounded-2xl font-semibold transition-all duration-300"
        >
          Create Account
        </button>
      </div>
    </div>

    <!-- Login Modal -->
    <Teleport to="body">
      <div
        v-if="showLoginModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="showLoginModal = false"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold">Welcome Back</h3>
            <button
              @click="showLoginModal = false"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="login" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >Email</label
                >
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >Password</label
                >
                <div class="relative">
                  <input
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 rounded-xl ..."
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  >
                    <component
                      :is="showPassword ? EyeOff : Eye"
                      class="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </button>

            <div v-if="showResendButton" class="mt-4 text-center">
              <p class="text-sm text-red-500 mb-2">Email not verified.</p>
              <button
                @click="resendVerification"
                class="text-sm text-blue-600 hover:underline"
              >
                Resend Verification Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Signup Modal -->
    <Teleport to="body">
      <div
        v-if="showSignupModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="showSignupModal = false"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold">Create Account</h3>
            <button
              @click="showSignupModal = false"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="signup" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >Name</label
                >
                <input
                  v-model="signupForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >Email</label
                >
                <input
                  v-model="signupForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >Password</label
                >
                <div class="relative">
                  <input
                    v-model="signupForm.password"
                    :type="showSignupPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 rounded-xl ..."
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    @click="showSignupPassword = !showSignupPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  >
                    <component
                      :is="showSignupPassword ? EyeOff : Eye"
                      class="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              :disabled="isLoading"
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
                  fill="url(#gradientSpinner)"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
                <defs>
                  <linearGradient
                    id="gradientSpinner"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stop-color="#3b82f6" />
                    <stop offset="100%" stop-color="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <span v-else>Create Account</span>
            </button>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showVerifyModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="showVerifyModal = false"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <div class="text-center space-y-4">
            <h3
              class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Check your inbox!
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              A verification email has been sent. Please confirm your address
              before logging in.
            </p>
            <button
              @click="showVerifyModal = false"
              class="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { X, Sun, Moon, CheckSquare, Eye, EyeOff } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth"; // or your correct path

const authComposable = useAuth();

defineProps({
  isDarkMode: Boolean,
});

const emit = defineEmits(["login", "signup", "toggle-dark-mode"]);

const showLoginModal = ref(false);
const showSignupModal = ref(false);
const showResendButton = ref(false);
const showVerifyModal = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const showSignupPassword = ref(false);
const emailForResend = ref("");

const loginForm = reactive({
  email: "",
  password: "",
});

const signupForm = reactive({
  name: "",
  email: "",
  password: "",
});

const login = async () => {
  try {
    showResendButton.value = false;
    emit("login", { ...loginForm });
    loginForm.email = "";
    loginForm.password = "";
    showLoginModal.value = false;
  } catch (err) {
    if (err.message === "Email not verified") {
      showResendButton.value = true;
      emailForResend.value = loginForm.email;
    } else {
      alert("❌ " + err.message);
    }
  }
};

// ✅ Signup
const signup = async () => {
  try {
    isLoading.value = true;
    const { user, emailSent } = await authComposable.handleSignup(signupForm);

    if (emailSent) {
      await authComposable.logout();
      showSignupModal.value = false;
      showVerifyModal.value = true;
    }
  } catch (error) {
    alert("❌ " + error.message);
  } finally {
    isLoading.value = false;
    signupForm.name = "";
    signupForm.email = "";
    signupForm.password = "";
  }
};

const resendVerification = async () => {
  try {
    const { auth } = await import("../firebase/firebase");
    const user = auth.currentUser;
    if (user) {
      await authComposable.resendEmailVerification(user);
      alert("✅ Verification email resent.");
    }
  } catch (err) {
    alert("❌ " + err.message);
  }
};
</script>
