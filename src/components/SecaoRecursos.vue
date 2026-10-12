<template>
  <!-- o título desta seção fica na faixa do topo recolhido (SecaoHero) -->
  <section id="recursos" class="px-2 md:px-3">
    <!-- abas + painel -->
    <!-- quadro do mockup mais largo: o notebook cabe inteiro dentro dele -->
    <div class="grid gap-2 md:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] md:gap-3">
      <div v-aparecer class="flex min-h-[380px] flex-col rounded-frame bg-panel md:h-[calc(100svh-var(--faixa,340px)-24px)] md:min-h-[420px]">
        <!-- abas: cada script com uma tinta, na ordem C M Y K -->
        <div class="m-3 grid grid-cols-2 gap-1.5 rounded-[20px] bg-[#EAEAE6] p-1.5 md:m-4 md:grid-cols-4" role="tablist">
          <button
            v-for="(a, i) in abas"
            :key="a.nome"
            v-aparecer="200 + i * 90"
            role="tab"
            :aria-selected="i === atual"
            class="group relative flex flex-col gap-2.5 rounded-[14px] p-3 text-left transition-[background-color,box-shadow] duration-300"
            :class="i === atual ? 'bg-white shadow-[0_8px_24px_-12px_rgba(11,18,34,.3)]' : 'hover:bg-white/60'"
            @click="ir(i, true)"
          >
            <span class="flex items-start gap-2">
              <span
                class="grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors duration-300"
                :style="i === atual ? { background: a.cor, color: a.corTexto } : { background: `${a.cor}22`, color: a.cor }"
              >
                <span class="h-3.5 w-3.5" v-html="a.icone"></span>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px] font-semibold leading-tight transition-colors" :class="i === atual ? 'text-ink' : 'text-ink/60 group-hover:text-ink'">{{ t(`scripts.${a.nome}`) }}</span>
                <span class="mt-0.5 block truncate text-[11px] leading-tight text-muted">{{ t(`abas.${a.nome}.sub`) }}</span>
              </span>
            </span>
            <!-- trilho + barra que acompanha o vídeo da aba, na cor dela (scaleX: anda em subpixel, sem degraus) -->
            <span class="relative block h-1 overflow-hidden rounded-full bg-ink/[.07]">
              <span
                v-if="i === atual"
                class="absolute inset-y-0 left-0 rounded-full"
                :style="{ background: a.cor, width: '100%', transform: `scaleX(${progressoVideo})`, transformOrigin: 'left center', willChange: 'transform' }"
              ></span>
            </span>
          </button>
        </div>

        <div v-aparecer="350" class="mt-auto p-6 md:p-8">
          <Transition name="aba" mode="out-in">
            <div :key="`txt-${atual}`">
              <h3 class="font-display text-[44px] leading-none md:text-[56px]">{{ t(`scripts.${abas[atual].nome}`) }}</h3>
              <p class="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-ink/70">{{ t(`abas.${abas[atual].nome}.texto`) }}</p>
              <button class="mt-6 rounded-xl bg-ink px-5 py-3 text-[14px] font-medium text-white transition hover:-translate-y-px hover:bg-azul" @click="baixar">
                {{ t("abas.botao") }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <div
        v-aparecer="150"
        class="relative z-10 min-h-[420px] rounded-frame md:h-[calc(100svh-var(--faixa,340px)-24px)]"
      >
        <!-- só o fundo fica recortado no quadro: a janela do app pode sair dele -->
        <div class="absolute inset-0 overflow-hidden rounded-frame"><FundoPixel glow="centro" /></div>
        <!-- notebook com o Corel + janela do SubliMaster; só monta quando o quadro aparece,
             para as animações de entrada rodarem na frente de quem está vendo -->
        <div ref="quadroMockup" class="relative z-10 flex h-full min-h-[inherit] items-center px-3 py-6 md:px-5">
          <MockupNotebook v-if="mockupVisto" :ativo="abas[atual].nome" :video="abas[atual].video" @progresso="progressoVideo = $event" @fim="proxima" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { registrar } from "../metricas";
import FundoPixel from "./FundoPixel.vue";
import MockupNotebook from "./MockupNotebook.vue";
import { baixar } from "../links";
import { ICONES } from "../icones";
import { t } from "../i18n";

// uma tinta de impressão por script, na ordem C M Y K
const COR = { repassar: "#00AEEF", uniforme: "#EC008C", organizar: "#FFD200", exportar: "#1A1A1A" };

const abas = [
  {
    nome: "Repassar",   // chave interna (marcas, menu); o texto vem do i18n
    cor: COR.repassar, corTexto: "#fff", icone: ICONES.repassar,
    // a aba dura o tempo do vídeo dela: troca quando ele termina
    video: "/demo-repassar.mp4",
  },
  {
    nome: "Uniforme",   // chave interna (marcas, menu); o texto vem do i18n
    cor: COR.uniforme, corTexto: "#fff", icone: ICONES.uniforme,
    video: "/demo-uniforme.mp4",
  },
  {
    nome: "Organizar",   // chave interna (marcas, menu); o texto vem do i18n
    cor: COR.organizar, corTexto: "#0E0E0C", icone: ICONES.organizar,
    video: "/demo-organizar.mp4",
  },
  {
    nome: "Exportar",   // chave interna (marcas, menu); o texto vem do i18n
    cor: COR.exportar, corTexto: "#fff", icone: ICONES.exportar,
    video: "/demo-exportar.mp4",
  },
];

const atual = ref(0);
const progressoVideo = ref(0);

// a aba troca quando o vídeo dela termina (com o clique no menu já incluído)
function ir(i, peloUsuario = false) {
  if (peloUsuario) registrar("aba", { det: abas[i].nome });
  atual.value = i;
  progressoVideo.value = 0;
}
const proxima = () => ir((atual.value + 1) % abas.length);

const quadroMockup = ref(null);
const mockupVisto = ref(false);
let obsMockup = null;

onMounted(() => {
  // o vídeo só começa quando o mockup aparece na tela
  obsMockup = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { mockupVisto.value = true; obsMockup.disconnect(); }
  }, { threshold: 0.25 });
  obsMockup.observe(quadroMockup.value);
});
onBeforeUnmount(() => { obsMockup && obsMockup.disconnect(); });
</script>
