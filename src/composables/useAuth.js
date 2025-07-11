"use client";

import { ref } from "vue";

export function useAuth() {
  const isAuthenticated = ref(false);
  const currentUser = ref(null);

  const handleLogin = async (credentials) => {
    // Mock authentication with promise for async handling
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(
          localStorage.getItem("taskSchedulerUsers") || "[]"
        );
        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          currentUser.value = user;
          isAuthenticated.value = true;
          localStorage.setItem(
            "taskSchedulerCurrentUser",
            JSON.stringify(user)
          );
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500); // Simulate network delay
    });
  };

  const handleSignup = async (userData) => {
    // Mock user registration with promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(
          localStorage.getItem("taskSchedulerUsers") || "[]"
        );

        if (users.find((u) => u.email === userData.email)) {
          reject(new Error("An account with this email already exists"));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
        };

        users.push(newUser);
        localStorage.setItem("taskSchedulerUsers", JSON.stringify(users));

        currentUser.value = newUser;
        isAuthenticated.value = true;
        localStorage.setItem(
          "taskSchedulerCurrentUser",
          JSON.stringify(newUser)
        );
        resolve(newUser);
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    currentUser.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("taskSchedulerCurrentUser");
  };

  // Check for saved authentication on load
  const savedUser = localStorage.getItem("taskSchedulerCurrentUser");
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
    isAuthenticated.value = true;
  }

  return {
    isAuthenticated,
    currentUser,
    handleLogin,
    handleSignup,
    logout,
  };
}
