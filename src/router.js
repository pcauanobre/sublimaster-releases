import { createRouter, createWebHistory } from "vue-router";
import PaginaInicio from "./views/PaginaInicio.vue";
import { registrar } from "./metricas";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "inicio", component: PaginaInicio },
    // formulário da chave de teste; ao enviar, vai para /baixar
    { path: "/teste", name: "teste", component: () => import("./views/PaginaTeste.vue") },
    // recado do Pedro + download
    { path: "/baixar", name: "baixar", component: () => import("./views/PaginaBaixar.vue") },
    // painel de leads e visitas (só o Pedro, com login)
    { path: "/admin", name: "admin", component: () => import("./views/PaginaAdmin.vue") },
    { path: "/:qualquer(.*)", redirect: "/" },
  ],
  scrollBehavior(to, from, salvo) {
    if (salvo) return salvo;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});

// uma visita por página aberta
router.afterEach((para) => { if (para.name !== "admin") registrar("visita"); });
