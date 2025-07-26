import { ref } from "vue";

const activeView = ref("dashboard");

export function useActiveView() {
  return {
    activeView,
  };
}
