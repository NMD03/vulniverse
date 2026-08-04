import {
  createRouter,
  createWebHistory,
} from "vue-router";

import EditorPage from
  "@/pages/EditorPage.vue";

import HomePage from
  "@/pages/HomePage.vue";

export const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL,
  ),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/editor/:recordId",
      name: "editor",
      component: EditorPage,
      props: false,
    },
  ],
});
