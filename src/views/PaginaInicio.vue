<template>
  <div>
    <!-- um elemento só na raiz (nem comentário fora): a troca de página precisa disso -->
  <!-- pb no celular: o rodapé não fica atrás da barra fixa de download -->
  <main class="pb-20 md:pb-0">
    <SecaoHero />
    <div class="h-2 md:h-3"></div>
    <SecaoRecursos />
    <SecaoResultados />
    <SecaoBaixar />
  </main>

  <!-- celular: download sempre à mão depois que o botão do topo some -->
  <div
    class="fixed inset-x-0 bottom-0 z-50 p-3 transition-transform duration-300 md:hidden"
    :class="mostrarBarra ? 'translate-y-0' : 'translate-y-full'"
    style="padding-bottom: calc(12px + env(safe-area-inset-bottom))"
  >
    <button class="w-full rounded-xl bg-azul py-3.5 text-[15px] font-medium text-white shadow-lg" @click="baixar">{{ t("hero.baixar") }}</button>
  </div>

  <!-- botão redondo do WhatsApp, fixo no canto (sobe quando a barra de baixar do celular aparece) -->
  <a
    :href="zap(t('whatsMsg'))"
    target="_blank"
    rel="noopener"
    :aria-label="t('whatsAria')"
    @click="registrar('whatsapp')"
    class="fixed right-4 z-50 grid h-14 w-14 animate-flutua place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition-[transform,bottom] duration-300 hover:scale-105 md:bottom-6 md:right-6 [animation-delay:1.5s]"
    :class="mostrarBarra ? 'bottom-24' : 'bottom-4'"
  >
    <span class="h-7 w-7" v-html="ICONES.whats"></span>
  </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import SecaoHero from "../components/SecaoHero.vue";
import SecaoRecursos from "../components/SecaoRecursos.vue";
import SecaoResultados from "../components/SecaoResultados.vue";
import SecaoBaixar from "../components/SecaoBaixar.vue";
import { baixar, zap } from "../links";
import { ICONES } from "../icones";
import { t } from "../i18n";
import { registrar } from "../metricas";

const mostrarBarra = ref(false);
const aoRolar = () => { mostrarBarra.value = window.scrollY > window.innerHeight * 0.7; };
onMounted(() => window.addEventListener("scroll", aoRolar, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", aoRolar));
</script>
