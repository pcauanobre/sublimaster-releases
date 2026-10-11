import { createRouter, createWebHistory } from "vue-router";
import PaginaInicio from "./views/PaginaInicio.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "inicio", component: PaginaInicio },
    // recado do Pedro + download depois de 3 segundos
    { path: "/baixar", name: "baixar", component: () => import("./views/PaginaBaixar.vue") },
    { path: "/:qualquer(.*)", redirect: "/" },
  ],
  scrollBehavior(to, from, salvo) {
    if (salvo) return salvo;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});
