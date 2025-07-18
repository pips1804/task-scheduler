import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../components/AuthPage.vue";
import Dashboard from "../views/Dashboard.vue"; // We’ll make this shortly
import VerifyEmail from "../views/VerifyEmail.vue"; // Optional

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: VerifyEmail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
