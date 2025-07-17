import { ref, reactive } from "vue";

export function useNotifications() {
  const showNotification = ref(false);
  const notification = reactive({
    type: "success",
    title: "",
    message: "",
    duration: 4000,
  });

  let timeoutId = null;

  const triggerNotification = (type, title, message, duration) => {
    // Clear any previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    notification.type = type;
    notification.title = title;
    notification.message = message;
    notification.duration = duration;
    showNotification.value = true;

    // Set timeout to hide notification
    timeoutId = setTimeout(() => {
      showNotification.value = false;
    }, duration);
  };

  const showSuccess = (title, message, duration = 4000) => {
    triggerNotification("success", title, message, duration);
  };

  const showError = (title, message, duration = 5000) => {
    triggerNotification("error", title, message, duration);
  };

  const showWarning = (title, message, duration = 4000) => {
    triggerNotification("warning", title, message, duration);
  };

  const showInfo = (title, message, duration = 4000) => {
    triggerNotification("info", title, message, duration);
  };

  const hideNotification = () => {
    showNotification.value = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return {
    showNotification,
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
}
