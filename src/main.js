import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import { aparecer } from "./aparecer";
import { router } from "./router";

createApp(App).use(router).directive("aparecer", aparecer).mount("#app");
