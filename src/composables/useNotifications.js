import { ref, reactive } from "vue";

export function useNotifications() {
  const showNotification = ref(false);
  const notification = reactive({
    type: "success",
    title: "",
    message: "",
    duration: 4000,
  });

  const showSuccess = (title, message, duration = 4000) => {
    notification.type = "success";
    notification.title = title;
    notification.message = message;
    notification.duration = duration;
    showNotification.value = true;
  };

  const showError = (title, message, duration = 5000) => {
    notification.type = "error";
    notification.title = title;
    notification.message = message;
    notification.duration = duration;
    showNotification.value = true;
  };

  const showWarning = (title, message, duration = 4000) => {
    notification.type = "warning";
    notification.title = title;
    notification.message = message;
    notification.duration = duration;
    showNotification.value = true;
  };

  const showInfo = (title, message, duration = 4000) => {
    notification.type = "info";
    notification.title = title;
    notification.message = message;
    notification.duration = duration;
    showNotification.value = true;
  };

  const hideNotification = () => {
    showNotification.value = false;
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
