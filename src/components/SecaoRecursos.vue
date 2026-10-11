<template>
  <!-- o título desta seção fica na faixa do topo recolhido (SecaoHero) -->
  <section id="recursos" class="px-2 md:px-3">
    <!-- abas + painel -->
    <div class="grid gap-2 md:grid-cols-2 md:gap-3">
      <div v-aparecer class="flex min-h-[380px] flex-col rounded-frame bg-panel md:h-[calc(100svh-var(--faixa,340px)-24px)] md:min-h-[420px]">
        <!-- abas: cada script com uma cor CMYK (ciano, magenta, amarelo, preto) -->
        <div class="m-3 grid grid-cols-2 gap-1.5 rounded-[20px] bg-[#EAEAE6] p-1.5 md:m-4 md:grid-cols-4" role="tablist">
          <button
            v-for="(a, i) in abas"
            :key="a.nome"
            v-aparecer="200 + i * 90"
            role="tab"
            :aria-selected="i === atual"
            class="group relative flex flex-col gap-2.5 rounded-[14px] p-3 text-left transition-[background-color,box-shadow] duration-300"
            :class="i === atual ? 'bg-white shadow-[0_8px_24px_-12px_rgba(11,18,34,.3)]' : 'hover:bg-white/60'"
            @click="ir(i)"
          >
            <span class="flex items-start gap-2">
              <span
                class="grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors duration-300"
                :style="i === atual ? { background: a.cor, color: a.corTexto } : { background: `${a.cor}22`, color: a.cor }"
              >
                <span class="h-3.5 w-3.5" v-html="a.icone"></span>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px] font-semibold leading-tight transition-colors" :class="i === atual ? 'text-ink' : 'text-ink/60 group-hover:text-ink'">{{ a.nome }}</span>
                <span class="mt-0.5 block min-h-[2.4em] text-[11px] leading-tight text-muted">{{ a.sub }}</span>
              </span>
            </span>
            <!-- trilho + barra que enche no tempo da troca, na cor da aba -->
            <span class="relative block h-1 overflow-hidden rounded-full bg-ink/[.07]">
              <span
                v-if="i === atual"
                :key="`barra-${ciclo}`"
                class="absolute inset-y-0 left-0 rounded-full"
                :style="{ background: a.cor, animation: `encher ${DURACAO}ms linear forwards`, animationPlayState: pausado ? 'paused' : 'running' }"
              ></span>
            </span>
          </button>
        </div>

        <div v-aparecer="350" class="mt-auto p-6 md:p-8">
          <Transition name="aba" mode="out-in">
            <div :key="`txt-${atual}`">
              <h3 class="animate-entra font-display text-[44px] leading-none md:text-[56px]">{{ abas[atual].titulo }}</h3>
              <p class="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-ink/70">{{ abas[atual].texto }}</p>
              <button class="mt-6 rounded-xl bg-ink px-5 py-3 text-[14px] font-medium text-white transition hover:-translate-y-px hover:bg-azul" @click="baixar">
                {{ abas[atual].botao }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <div
        v-aparecer="150"
        class="relative min-h-[420px] overflow-hidden rounded-frame md:h-[calc(100svh-var(--faixa,340px)-24px)]"
        @mouseenter="pausado = true"
        @mouseleave="pausado = false"
      >
        <FundoPixel glow="centro" />
        <!-- notebook com o Corel + janela do SubliMaster; só monta quando o quadro aparece,
             para as animações de entrada rodarem na frente de quem está vendo -->
        <div ref="quadroMockup" class="relative z-10 flex h-full min-h-[inherit] items-center px-3 py-6 md:px-5">
          <MockupNotebook v-if="mockupVisto" :ativo="abas[atual].nome" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import FundoPixel from "./FundoPixel.vue";
import MockupNotebook from "./MockupNotebook.vue";
import { baixar } from "../links";
import { ICONES } from "../icones";
import VisualRepassar from "./visuais/VisualRepassar.vue";
import VisualUniforme from "./visuais/VisualUniforme.vue";
import VisualExportar from "./visuais/VisualExportar.vue";
import VisualOrganizar from "./visuais/VisualOrganizar.vue";

const DURACAO = 6000;

// as quatro tintas da impressão: ciano, magenta, amarelo e preto (key)
const CMYK = { c: "#00AEEF", m: "#EC008C", y: "#FFD200", k: "#1A1A1A" };

const abas = [
  {
    nome: "Repassar", sub: "Um molde, todos os tamanhos",
    cor: CMYK.c, corTexto: "#fff", icone: ICONES.repassar,
    titulo: "Repassar",
    texto: "Acerte a arte em um molde. O SubliMaster copia pra todos os outros tamanhos e centraliza os textos em cada um.",
    botao: "Repassar em 4 segundos", visual: VisualRepassar,
  },
  {
    nome: "Uniforme", sub: "Da lista ao molde",
    cor: CMYK.m, corTexto: "#fff", icone: ICONES.uniforme,
    titulo: "Uniforme",
    texto: "Cole a lista que o cliente mandou no WhatsApp. Cada linha vira uma peça com nome, número e tamanho no lugar.",
    botao: "Montar o pedido", visual: VisualUniforme,
  },
  {
    nome: "Exportar", sub: "Uma peça, um arquivo",
    cor: CMYK.y, corTexto: "#0E0E0C", icone: ICONES.exportar,
    titulo: "Exportar",
    texto: "Cada peça vira um arquivo nomeado em JPG, PNG ou PDF, 300 DPI, CMYK. Igual ao seu Ctrl+E, só que em lote.",
    botao: "Exportar o lote", visual: VisualExportar,
  },
  {
    nome: "Organizar", sub: "A folha montada",
    cor: CMYK.k, corTexto: "#fff", icone: ICONES.organizar,
    titulo: "Organizar",
    texto: "Diga a largura da folha, o espaço e a margem. Ele encaixa as peças, aproveita os vãos e abre outra folha quando enche.",
    botao: "Montar a folha", visual: VisualOrganizar,
  },
];

const atual = ref(0);
const ciclo = ref(0);
const pausado = ref(false);
let timer = null;
let restante = DURACAO;
let inicio = 0;

function agendar(ms) {
  clearTimeout(timer);
  inicio = Date.now();
  restante = ms;
  timer = setTimeout(() => ir((atual.value + 1) % abas.length), ms);
}

function ir(i) {
  atual.value = i;
  ciclo.value++;
  agendar(DURACAO);
}

// passar o mouse no visual congela a troca, pra dar tempo de ler
watch(pausado, (p) => {
  if (p) {
    clearTimeout(timer);
    restante -= Date.now() - inicio;
  } else {
    agendar(Math.max(500, restante));
  }
});

const quadroMockup = ref(null);
const mockupVisto = ref(false);
let obsMockup = null;

onMounted(() => {
  agendar(DURACAO);
  obsMockup = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { mockupVisto.value = true; obsMockup.disconnect(); }
  }, { threshold: 0.25 });
  obsMockup.observe(quadroMockup.value);
});
onBeforeUnmount(() => { clearTimeout(timer); obsMockup && obsMockup.disconnect(); });
</script>
