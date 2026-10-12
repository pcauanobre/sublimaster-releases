<template>
  <!-- A seção tem a altura da tela; o quadro escuro fica preso no topo e
       recolhe até virar a faixa do título "Automatize o repetitivo". -->
  <section id="inicio" class="relative px-2 pt-2 md:px-3 md:pt-3" :style="{ height: `${tela}px` }">
    <div class="sticky top-2 overflow-hidden rounded-frame md:top-3" :style="{ height: `${altura - margem}px` }">
      <!-- fundo com a altura da tela inteira: ao recolher, o brilho de baixo sai e sobra a grade -->
      <div class="absolute inset-x-0 top-0" :style="{ height: `${tela}px` }">
        <FundoPixel />
      </div>

      <BarraTopo class="animate-surge" />

      <!-- conteúdo do topo: sobe e some enquanto o quadro recolhe -->
      <div
        class="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center justify-center px-5 pb-10 pt-[72px] text-center"
        :class="progresso > 0.5 ? 'pointer-events-none' : ''"
        :style="{ height: `${tela - margem}px`, opacity: saida, transform: `translateY(${-progresso * 40}px)` }"
      >
        <!-- logo: chega do desfoque com um leve "pulo" e solta um anel azul -->
        <div class="relative">
          <span class="intro-glow absolute inset-0 -z-10 scale-125 rounded-full bg-azul/50 blur-3xl"></span>
          <span class="intro-anel absolute inset-[-12%] -z-10 rounded-full border-2 border-azul-claro/70"></span>
          <img src="/logo.png" alt="SubliMaster" class="intro-logo h-24 w-24 md:h-40 md:w-40" />
        </div>

        <!-- título: cada linha sobe de trás de uma máscara -->
        <h1 class="mt-5 font-display text-[31px] leading-[1.04] text-white sm:text-[46px] md:text-[68px]">
          <span v-for="(l, i) in linhas" :key="l" class="block overflow-hidden pb-[.08em]">
            <span
              class="intro-linha block"
              :class="i === 2 ? 'bg-gradient-to-r from-azul-claro via-azul to-azul-claro bg-clip-text text-transparent' : ''"
              :style="{ animationDelay: `${0.25 + i * 0.08}s` }"
            >{{ l }}</span>
          </span>
        </h1>
        <!-- botões só aparecem depois da descida automática (quem voltar pro topo vê) -->
        <div v-if="mostrarBotoes" class="intro-sobe mt-7 flex justify-center">
          <button class="inline-flex items-center justify-center gap-2 rounded-xl bg-azul px-5 py-3 text-[14px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,.8)] transition hover:-translate-y-px hover:bg-[#2563EB]" @click="baixar">
            {{ t("hero.baixar") }}<span class="h-4 w-4" v-html="ICONES.seta"></span>
          </button>
        </div>
      </div>

      <!-- título da faixa: entra desfocando quando o quadro termina de recolher -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-center px-5 pt-14 md:pt-12"
        :style="{ height: `${faixa - margem}px` }"
      >
        <h2
          class="text-center font-display text-[30px] leading-[1.02] text-white md:text-[46px]"
          :style="{ opacity: entrada, filter: `blur(${(1 - entrada) * 12}px)`, transform: `translateY(${(1 - entrada) * 12}px)` }"
        >
          {{ t("hero.faixa")[0] }}<br />{{ t("hero.faixa")[1] }}<br /><span class="text-azul-claro">{{ t("hero.faixa")[2] }}</span>
        </h2>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from "vue";
import FundoPixel from "./FundoPixel.vue";
import BarraTopo from "./BarraTopo.vue";
import { baixar } from "../links";
import { ICONES } from "../icones";
import { t } from "../i18n";
import { useEncolherAoRolar } from "../composables/useEncolherAoRolar";

// altura da faixa recolhida: menu + título de três linhas
const alturaFaixa = (tela) => (window.innerWidth >= 768 ? Math.min(340, tela * 0.4) : 270);

const { tela, altura, progresso } = useEncolherAoRolar(alturaFaixa);

const margem = computed(() => (window.innerWidth >= 768 ? 12 : 8));
const faixa = computed(() => alturaFaixa(tela.value));

// o conteúdo do topo some na primeira metade; o título da faixa entra no fim
const saida = computed(() => Math.max(0, 1 - progresso.value * 2.2));
const entrada = computed(() => Math.min(1, Math.max(0, (progresso.value - 0.3) / 0.45)));

const linhas = computed(() => t("hero.linhas"));

// a seção de baixo usa a altura da faixa para caber inteira na tela
watchEffect(() => document.documentElement.style.setProperty("--faixa", `${faixa.value}px`));

// Entrada do topo (só no PC): depois de ESPERA o site desce sozinho até as abas +
// mockup. Se a pessoa tentar rolar antes, não rola livre: a descida começa na hora.
const ESPERA = 2500; // ~0,9 s de entrada + 1,6 s parado
let timer = 0;
let quadro = 0;
let travado = false;
const mostrarBotoes = ref(false);

const TECLAS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"];
let desceu = false;
const bloquear = (e) => {
  if (e.type === "keydown" && !TECLAS.includes(e.key)) return;
  e.preventDefault();
  // tentou rolar: pula a espera e desce já
  if (!desceu) { clearTimeout(timer); descer(); }
};
const EVENTOS = ["wheel", "touchmove", "keydown"];
function travar() {
  travado = true;
  document.documentElement.style.overflow = "hidden";
  EVENTOS.forEach((ev) => window.addEventListener(ev, bloquear, { passive: false }));
}
function destravar() {
  if (!travado) return;
  travado = false;
  document.documentElement.style.overflow = "";
  EVENTOS.forEach((ev) => window.removeEventListener(ev, bloquear));
}

function descer() {
  if (desceu) return;
  desceu = true;
  if (window.innerWidth < 768) { mostrarBotoes.value = true; destravar(); return; }
  // um pouco além da faixa recolhida: a janela do app (que passa do quadro) aparece inteira
  const alvo = tela.value - faixa.value + Math.round(window.innerHeight * 0.1);
  const inicio = performance.now();
  const DURACAO = 750;
  // o overflow travado impede o scrollTo: libera só o JS durante a descida
  document.documentElement.style.overflow = "";
  const passo = (agora) => {
    const t = Math.min(1, (agora - inicio) / DURACAO);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo({ top: alvo * e, behavior: "instant" });
    if (t < 1) quadro = requestAnimationFrame(passo);
    else { mostrarBotoes.value = true; destravar(); }
  };
  quadro = requestAnimationFrame(passo);
}

onMounted(() => {
  if (window.innerWidth >= 768 && window.scrollY < 5) travar();
  else mostrarBotoes.value = true;
  timer = setTimeout(descer, ESPERA);
});
onBeforeUnmount(() => {
  clearTimeout(timer);
  cancelAnimationFrame(quadro);
  destravar();
});</script>
