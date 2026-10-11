<template>
  <!-- Aviso "O Windows protegeu o computador" desenhado em código, em loop:
       o cursor clica em "Mais informações", a janela vira o passo 2 e o
       cursor clica em "Executar assim mesmo". Português ou inglês. -->
  <div ref="caixa" class="relative select-none">
    <div class="relative flex aspect-[1.07] flex-col overflow-hidden rounded-lg bg-[#1F5BA8] p-[6.5%] text-white shadow-[0_30px_60px_-24px_rgba(0,0,0,.7)] ring-1 ring-black/20">
      <span class="absolute right-0 top-0 grid h-8 w-11 place-items-center bg-white text-[#1F5BA8]">
        <svg viewBox="0 0 10 10" class="h-[38%] w-[38%]" stroke="currentColor" stroke-width="1.4"><path d="M1 1l8 8M9 1 1 9" /></svg>
      </span>

      <p class="pr-[12%] text-[clamp(18px,2vw,24px)] font-light leading-tight">{{ t.titulo }}</p>
      <p class="mt-[5%] text-[clamp(11px,0.95vw,12.5px)] leading-snug text-white/90">{{ t.texto }}</p>

      <Transition name="aba" mode="out-in">
        <span
          v-if="passo === 1"
          key="mais"
          ref="alvoMais"
          class="relative mt-[3%] w-fit text-[clamp(10px,1vw,12.5px)] underline underline-offset-2 transition-colors"
          :class="clicando ? 'text-white/50' : ''"
        >
          {{ t.mais }}
        </span>
        <dl v-else key="info" class="mt-[4%] grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[clamp(10px,1vw,12.5px)] text-white/90">
          <dt>{{ t.app }}</dt><dd>SubliMaster-Setup.exe</dd>
          <dt>{{ t.fornecedor }}</dt><dd>{{ t.desconhecido }}</dd>
        </dl>
      </Transition>

      <div class="mt-auto flex justify-end gap-2 text-[clamp(10px,0.95vw,12px)] font-medium">
        <Transition name="aba">
          <span
            v-if="passo === 2"
            ref="alvoExecutar"
            class="relative border border-white px-3 py-1.5 transition-[background-color,transform] duration-150"
            :class="clicando ? 'scale-95 bg-white/75 text-[#1F5BA8]' : 'bg-white text-[#1F5BA8]'"
          >
            {{ t.executar }}
          </span>
        </Transition>
        <span class="border border-white/80 px-3 py-1.5">{{ t.naoExecutar }}</span>
      </div>

      <!-- fim do loop: pronto -->
      <Transition name="aba">
        <div v-if="passo === 3" class="absolute inset-0 grid place-items-center bg-[#1F5BA8]/95">
          <div class="flex items-center gap-2 text-[clamp(14px,1.6vw,18px)]">
            <span class="grid h-7 w-7 place-items-center rounded-full bg-white text-[#1F5BA8]"><Check :size="16" :stroke-width="3" /></span>
            {{ t.pronto }}
          </div>
        </div>
      </Transition>
    </div>

    <!-- onda do clique: anel branco que se espalha a partir da ponta do dedo -->
    <span
      v-if="cliques"
      :key="cliques"
      class="onda-clique pointer-events-none absolute h-10 w-10 rounded-full border-2 border-white bg-white/25"
      :style="{ left: `${cursor.x + PONTA.x - 20}px`, top: `${cursor.y + PONTA.y - 20}px` }"
    ></span>

    <!-- cursor de mãozinha (o do Windows em cima de link e botão) -->
    <svg
      viewBox="0 0 24 24"
      class="pointer-events-none absolute left-0 top-0 h-[30px] w-[30px] drop-shadow-[0_3px_4px_rgba(0,0,0,.45)] transition-[transform,opacity] ease-[cubic-bezier(.65,0,.35,1)]"
      :style="{ transform: `translate(${cursor.x}px, ${cursor.y}px) scale(${clicando ? 0.85 : 1})`, transformOrigin: '37% 6%', opacity: cursor.visivel ? 1 : 0, transitionDuration: clicando ? '120ms' : '900ms' }"
    >
      <path
        d="M9 1.5c-1 0-1.8.8-1.8 1.8v8.4l-1.4-1.4c-.7-.7-1.9-.7-2.6 0s-.7 1.9 0 2.6l4.6 5.2c1.1 1.3 2.7 2.4 4.6 2.4h3.2c2.7 0 4.9-2.2 4.9-4.9v-5.1c0-1-.8-1.8-1.8-1.8-.4 0-.8.1-1.1.4-.2-.8-1-1.4-1.8-1.4-.5 0-.9.2-1.2.4-.3-.7-1-1.2-1.8-1.2-.4 0-.7.1-1 .3V3.3c0-1-.8-1.8-1.8-1.8z"
        fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"
      />
      <path d="M10.8 9.2v3.6M13.8 9.8v3M16.8 10.8v2.2" stroke="#111" stroke-width="1" stroke-linecap="round" />
    </svg>  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { Check } from "lucide-vue-next";

const props = defineProps({
  idioma: { type: String, default: "pt" }, // "pt" | "en"
});
const emit = defineEmits(["passo"]);

const TEXTOS = {
  pt: {
    titulo: "O Windows protegeu o computador",
    texto: "O Microsoft Defender SmartScreen impediu que um aplicativo não reconhecido fosse iniciado. A execução deste aplicativo pode colocar o computador em risco.",
    mais: "Mais informações",
    app: "Aplicativo:",
    fornecedor: "Fornecedor:",
    desconhecido: "Fornecedor desconhecido",
    executar: "Executar assim mesmo",
    naoExecutar: "Não executar",
    pronto: "Pronto, a instalação começa",
  },
  en: {
    titulo: "Windows protected your PC",
    texto: "Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this app might put your PC at risk.",
    mais: "More info",
    app: "App:",
    fornecedor: "Publisher:",
    desconhecido: "Unknown publisher",
    executar: "Run anyway",
    naoExecutar: "Don't run",
    pronto: "Done, setup starts",
  },
};
const t = computed(() => TEXTOS[props.idioma] || TEXTOS.pt);

const caixa = ref(null);
const alvoMais = ref(null);
const alvoExecutar = ref(null);
const passo = ref(1); // 1 = Mais informações, 2 = Executar assim mesmo, 3 = pronto
const clicando = ref(false);
const cliques = ref(0);
// ponta do dedo do cursor: (9, 1.5) no desenho de 24, mostrado em 30px
const PONTA = { x: 9 * (30 / 24), y: 1.5 * (30 / 24) };
const cursor = reactive({ x: 0, y: 0, visivel: false });

watch(passo, (p) => emit("passo", p), { immediate: true });

let timers = [];
const depois = (ms, fn) => timers.push(setTimeout(fn, ms));
const limpar = () => { timers.forEach(clearTimeout); timers = []; };

// leva a ponta do cursor até o meio do alvo
function apontar(alvo, tentativas = 15) {
  const el = alvo.value;
  if (!caixa.value) return;
  // o alvo ainda está entrando (transição): tenta de novo logo em seguida
  if (!el) {
    if (tentativas > 0) depois(100, () => apontar(alvo, tentativas - 1));
    return;
  }
  const c = caixa.value.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  // a página pode estar diminuída (useCaberNaTela): converte a medida da tela
  // para o tamanho real da caixa, senão o cursor erra o alvo
  const k = caixa.value.offsetWidth / c.width || 1;
  cursor.x = (r.left - c.left + r.width * 0.5) * k - PONTA.x;
  cursor.y = (r.top - c.top + r.height * 0.55) * k - PONTA.y;
}
// cursor entra pelo canto de baixo
function canto() {
  if (!caixa.value) return;
  const c = caixa.value.getBoundingClientRect();
  cursor.x = caixa.value.offsetWidth * 0.45;
  cursor.y = caixa.value.offsetHeight * 0.85;
}


function ciclo() {
  limpar();
  passo.value = 1;
  clicando.value = false;
  canto();
  cursor.visivel = true;
  // chega, para em cima, aperta, solta (onda) e só então a janela reage
  depois(400, () => apontar(alvoMais));
  depois(1600, () => { clicando.value = true; });
  depois(1750, () => { clicando.value = false; cliques.value++; });
  depois(2050, () => { passo.value = 2; });
  depois(2900, async () => { await nextTick(); apontar(alvoExecutar); });
  depois(4100, () => { clicando.value = true; });
  depois(4250, () => { clicando.value = false; cliques.value++; });
  depois(4550, () => { passo.value = 3; cursor.visivel = false; });
  // volta ao passo 1 com o cursor escondido, para o link já estar na tela no próximo ciclo
  depois(5900, () => { passo.value = 1; });
  depois(6900, ciclo);
}

// troca de idioma ou de tamanho de tela: recomeça para o cursor mirar certo
watch(() => props.idioma, () => nextTick(ciclo));
let aoRedimensionar = () => ciclo();

onMounted(() => {
  nextTick(ciclo);
  window.addEventListener("resize", aoRedimensionar);
});
onBeforeUnmount(() => {
  limpar();
  window.removeEventListener("resize", aoRedimensionar);
});
</script>
