<template>
  <main class="p-2 md:p-3">
    <!-- Recado do Pedro: o download começa ao abrir e a página mostra,
         em loop, como passar pelo aviso azul do Windows. -->
    <div class="relative flex min-h-[calc(100svh-16px)] flex-col overflow-hidden rounded-frame text-white md:h-[calc(100vh-24px)] md:min-h-0">
      <FundoPixel />

      <!-- só a marca, no centro (o logo leva de volta pro início) -->
      <header class="relative z-20 flex shrink-0 items-center justify-center px-5 pt-5 md:pt-6">
        <RouterLink to="/" class="flex animate-foca items-center gap-2 text-[15px] font-semibold tracking-tight">
          <img src="/logo.png" alt="" class="h-7 w-7" />
          SubliMaster
        </RouterLink>
        <button
          class="absolute right-5 top-5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/85 transition hover:bg-white/10 md:right-7 md:top-6"
          :title="t('idioma') === 'English' ? 'Mudar para português' : 'Switch to English'"
      @click="alternarIdioma"
        >
          <span class="flex items-center gap-1.5"><svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>{{ t("idioma") }}</span>
        </button>
      </header>

      <!-- espaço que sobra embaixo do topo: o conteúdo diminui até caber, sem rolagem -->
      <div ref="espaco" class="relative z-10 flex flex-1 justify-center px-5 pb-10 pt-8 md:min-h-0 md:items-center md:px-8 md:py-8">
        <div class="w-full md:w-auto" :style="alturaFinal ? { height: `${alturaFinal}px` } : null">
      <div
        ref="conteudo"
        class="grid gap-8 md:w-max md:grid-cols-[300px_640px] md:gap-14"
        :style="{ transform: `scale(${escala})`, transformOrigin: 'top center' }"
      >
        <!-- foto + redes; no PC a coluna estica até a base do texto ao lado -->
        <aside class="flex flex-col gap-3">
          <div class="relative aspect-[4/5] animate-flutua overflow-hidden rounded-[22px] border border-white/10 bg-white/5 [animation-delay:.15s] md:aspect-auto md:min-h-[220px] md:flex-1">
            <img src="/pedro.webp" alt="Pedro Cauã Nobre" class="absolute inset-0 h-full w-full object-cover object-[60%_20%]" />
          </div>
          <a
            v-for="(r, i) in redes"
            :key="r.nome"
            :href="r.url"
            target="_blank"
            rel="noopener"
            class="group flex animate-flutua items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition hover:border-azul/60 hover:bg-azul/15"
            :style="{ animationDelay: `${0.3 + i * 0.1}s` }"
          >
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 transition group-hover:bg-azul">
              <span class="h-4 w-4" v-html="r.icone"></span>
            </span>
            <span class="min-w-0">
              <span class="block text-[11px] text-white/50">{{ r.nome }}</span>
              <span class="block truncate text-[14px] font-medium">{{ r.texto }}</span>
            </span>
            <span class="ml-auto h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" v-html="ICONES.seta"></span>
          </a>
        </aside>

        <!-- recado + como passar pelo aviso -->
        <section class="flex flex-col">
          <span class="animate-foca font-mono text-[11px] uppercase tracking-wider text-white/50 [animation-delay:.2s]">{{ t("baixar.rotulo") }}</span>
          <h1 class="mt-3 animate-foca font-display text-[40px] leading-[1.02] md:text-[60px] [animation-delay:.3s]">
            {{ t("baixar.ola") }} <span class="text-azul-claro">Pedro</span>
          </h1>
          <p class="mt-2 animate-foca text-[15px] text-white/60 [animation-delay:.4s]">{{ t("baixar.produtor") }}</p>

          <div class="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
            <p class="animate-foca [animation-delay:.5s]">
              {{ t("baixar.p1") }}
            </p>
            <p class="animate-foca [animation-delay:.6s]">
              {{ t("baixar.p2") }}
            </p>
          </div>

          <!-- janela animada, no formato real do aviso e na largura do texto -->
          <div class="mt-8 w-full animate-flutua [animation-delay:.7s]">
            <!-- o aviso aparece no idioma do site (o mesmo do Windows, na maioria das vezes) -->
            <DemoSmartScreen :idioma="idioma" />
          </div>
          <p class="mt-6 animate-foca text-center text-[13px] text-white/50 [animation-delay:.9s]">
            {{ t("baixar.naoComecou") }}
            <button class="font-medium text-azul-claro underline underline-offset-2 hover:text-white" @click="iniciarDownload('manual')">{{ t("baixar.cliqueAqui") }}</button>
          </p>
        </section>
      </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { t, idioma, alternarIdioma } from "../i18n";
import FundoPixel from "../components/FundoPixel.vue";
import DemoSmartScreen from "../components/DemoSmartScreen.vue";
import { ICONES } from "../icones";
import { useCaberNaTela } from "../composables/useCaberNaTela";
import { iniciarDownload, zap, WHATSAPP, INSTAGRAM, PORTFOLIO } from "../links";

const redes = computed(() => [
  { nome: "Instagram", texto: "@pcauanobre", url: INSTAGRAM, icone: ICONES.instagram },
  {
    nome: "WhatsApp",
    texto: `(${WHATSAPP.slice(2, 4)}) ${WHATSAPP.slice(4, 9)}-${WHATSAPP.slice(9)}`,
    url: zap(t("whatsMsg")),
    icone: ICONES.whats,
  },
  { nome: t("baixar.portfolio"), texto: "pedrocauanobre.is-a.dev", url: PORTFOLIO, icone: ICONES.globo },
]);

const espaco = ref(null);
const conteudo = ref(null);
const { escala, alturaFinal } = useCaberNaTela(conteudo, espaco);

// o download começa assim que a página abre
onMounted(iniciarDownload);
</script>
