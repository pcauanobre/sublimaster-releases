<template>
  <main class="p-2 md:p-3">
    <!-- Recado do Pedro: o download começa ao abrir e a página mostra,
         em loop, como passar pelo aviso azul do Windows. -->
    <div class="relative flex min-h-[calc(100svh-16px)] flex-col overflow-hidden rounded-frame text-white md:h-[calc(100vh-24px)] md:min-h-0">
      <FundoPixel />

      <header class="relative z-20 flex shrink-0 items-center justify-between px-5 pt-5 md:px-7 md:pt-6">
        <RouterLink to="/" class="flex animate-foca items-center gap-2 text-[15px] font-semibold tracking-tight">
          <img src="/logo.png" alt="" class="h-7 w-7" />
          SubliMaster
        </RouterLink>
        <RouterLink
          to="/"
          class="animate-foca rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/80 transition hover:bg-white/10 [animation-delay:.2s]"
        >
          ← Voltar
        </RouterLink>
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
          <span class="animate-foca font-mono text-[11px] uppercase tracking-wider text-white/50 [animation-delay:.2s]">Antes de instalar</span>
          <h1 class="mt-3 animate-foca font-display text-[40px] leading-[1.02] md:text-[60px] [animation-delay:.3s]">
            Olá, eu sou o <span class="text-azul-claro">Pedro</span>
          </h1>
          <p class="mt-2 animate-foca text-[15px] text-white/60 [animation-delay:.4s]">Produtor do SubliMaster.</p>

          <div class="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
            <p class="animate-foca [animation-delay:.5s]">
              Como o SubliMaster é novo, o Windows ainda não conhece o programa. Por isso, na primeira instalação, ele mostra um aviso azul. É normal e só acontece uma vez.
            </p>
            <p class="animate-foca [animation-delay:.6s]">
              Pode ficar tranquilo: o SubliMaster não tem vírus e só trabalha dentro do seu CorelDRAW. Qualquer dúvida, me chama no WhatsApp que eu respondo pessoalmente.
            </p>
          </div>

          <!-- janela animada, no formato real do aviso e na largura do texto -->
          <div class="mt-8 w-full animate-flutua [animation-delay:.7s]">
            <DemoSmartScreen idioma="en" />
          </div>
          <p class="mt-6 animate-foca text-center text-[13px] text-white/50 [animation-delay:.9s]">
            O download não começou?
            <button class="font-medium text-azul-claro underline underline-offset-2 hover:text-white" @click="iniciarDownload">Clique aqui</button>
          </p>
        </section>
      </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FundoPixel from "../components/FundoPixel.vue";
import DemoSmartScreen from "../components/DemoSmartScreen.vue";
import { ICONES } from "../icones";
import { useCaberNaTela } from "../composables/useCaberNaTela";
import { iniciarDownload, zap, WHATSAPP, INSTAGRAM, PORTFOLIO } from "../links";

const redes = [
  { nome: "Instagram", texto: "@pcauanobre", url: INSTAGRAM, icone: ICONES.instagram },
  {
    nome: "WhatsApp",
    texto: `(${WHATSAPP.slice(2, 4)}) ${WHATSAPP.slice(4, 9)}-${WHATSAPP.slice(9)}`,
    url: zap("Oi Pedro! Vim pelo site do SubliMaster."),
    icone: ICONES.whats,
  },
  { nome: "Portfólio", texto: "pedrocauanobre.is-a.dev", url: PORTFOLIO, icone: ICONES.globo },
];

const espaco = ref(null);
const conteudo = ref(null);
const { escala, alturaFinal } = useCaberNaTela(conteudo, espaco);

// o download começa assim que a página abre
onMounted(iniciarDownload);
</script>
