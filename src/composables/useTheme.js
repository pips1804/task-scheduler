"use client"

import { ref, watch } from "vue"

export function useTheme() {
  const isDarkMode = ref(false)

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem("taskSchedulerDarkMode")
  if (savedTheme) {
    isDarkMode.value = savedTheme === "true"
  }

  // Watch for theme changes and save to localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem("taskSchedulerDarkMode", newValue.toString())
  })

  return {
    isDarkMode,
    toggleDarkMode,
  }
}
