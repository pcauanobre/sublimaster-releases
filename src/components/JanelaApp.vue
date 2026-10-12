<template>
  <!-- Menu do SubliMaster igual à tela real do app (347 x 831). Quem usa reduz com transform. -->
  <div data-janela-app class="relative h-[831px] w-[347px] text-white">
    <!-- contorno branco POR FORA da janela recortada: cobre a borda escura do recorte -->
    <span class="pointer-events-none absolute -inset-[1.5px] z-20 rounded-[11.5px] border-[3px] border-white"></span>
    <!-- cantos de referência: servem para achar na tela um ponto dado em % do menu,
         mesmo com a janela aumentada e entortada -->
    <span data-canto="a" class="pointer-events-none absolute left-0 top-0 h-0 w-0"></span>
    <span data-canto="b" class="pointer-events-none absolute right-0 top-0 h-0 w-0"></span>
    <span data-canto="c" class="pointer-events-none absolute bottom-0 left-0 h-0 w-0"></span>
    <!-- a janela em si (cantos arredondados); o cursor anda DENTRO dela e é cortado na borda,
         como se viesse do Corel e voltasse para ele -->
    <div ref="janela" class="janela-recorte relative flex h-full w-full flex-col bg-[radial-gradient(120%_60%_at_50%_0%,#1a2540_0%,#0f172a_55%)]">
    <!-- barra de título do Windows -->
    <div class="flex h-[30px] shrink-0 items-center justify-between bg-black pl-2 text-[12px] text-white">
      <span class="flex items-center gap-2"><img src="/logo.png" alt="" class="h-4 w-4" />SubliMaster</span>
      <span class="flex h-full text-white/80">
        <span v-for="(b, i) in botoes" :key="b" class="grid w-[46px] place-items-center" :class="i === 1 ? 'text-white/35' : ''">
          <svg viewBox="0 0 10 10" class="h-2.5 w-2.5" fill="none" stroke="currentColor"><path :d="b" /></svg>
        </span>
      </span>
    </div>

    <div class="relative flex flex-1 flex-col items-center px-[22px]">
      <span class="absolute right-[13px] top-[12px] grid h-[32px] w-[32px] place-items-center rounded-[8px] border border-white/15 bg-white/5 text-white/85">
        <Settings :size="17" />
      </span>

      <img src="/logo.png" alt="" class="mt-[14px] h-[72px] w-[72px]" />
      <p class="mt-[4px] text-[22px] font-bold tracking-tight">SubliMaster</p>

      <!-- 4 scripts numa coluna: quadrados 118x118 (1:1), como no app -->
      <div class="my-[10px] flex flex-1 flex-col items-center justify-center gap-[8px]">
        <div
          v-for="s in scripts"
          :key="s.nome"
          :data-tile="s.nome"
          class="relative flex h-[118px] w-[118px] flex-col items-center justify-center gap-[6px] overflow-hidden rounded-[16px] border transition-[transform,border-color] duration-200"
          :class="[
            hover === s.nome ? 'border-[color:var(--c)]' : 'border-white/10',
            apertado === s.nome ? 'scale-[.96]' : '',
          ]"
          :style="{ '--c': s.cor, background: '#1e293b' }"
        >
          <span
            class="grid h-[38px] w-[38px] place-items-center rounded-[11px]"
            :style="s.preto ? { background: 'rgba(229,231,235,.18)', color: '#000' } : { background: `${s.cor}2e`, color: s.cor }"
          >
            <span class="h-[19px] w-[19px]" v-html="s.icone"></span>
          </span>
          <span class="text-[14px] font-bold">{{ t(`scripts.${s.nome}`) }}</span>
          <!-- hover igual ao app: véu escuro + botão play que cresce no meio -->
          <span class="absolute inset-0 bg-[rgba(2,6,23,.55)] transition-opacity duration-200" :class="hover === s.nome ? 'opacity-100' : 'opacity-0'"></span>
          <span
            class="absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px] grid h-[44px] w-[44px] place-items-center rounded-full text-[#0f172a] transition-[transform,opacity] duration-200"
            :class="hover === s.nome ? 'scale-100 opacity-100' : 'scale-[.4] opacity-0'"
            :style="{ background: s.cor, boxShadow: `0 10px 24px -8px ${s.cor}` }"
          >
            <svg viewBox="0 0 24 24" class="ml-[3px] h-5 w-5" fill="currentColor"><path d="m7 4 13 8-13 8V4z" /></svg>
          </span>
        </div>
      </div>

      <div class="grid h-[34px] w-full place-items-center rounded-[10px] bg-[#ef4444] text-[13.5px] font-bold">{{ t("app.parar") }}</div>
      <div class="mt-[8px] grid h-[28px] w-full place-items-center rounded-[8px] border border-white/15 text-[12px] font-bold">{{ t("app.bandeja") }}</div>      <p class="mt-[10px] text-[13px] font-bold text-white/55">Pedro · v1.0.55</p>
      <p class="mt-[6px] text-[11px] text-white/45">{{ t("app.direitos") }}</p>
      <p class="mb-[10px] mt-[6px] text-[12px] font-bold">{{ t("app.licenca") }}</p>
    </div>

    <!-- cursor do CorelDRAW: entra pela borda, clica no script e sai pela borda -->
    <div class="pointer-events-none absolute inset-0 z-10">
      <span
        v-if="onda"
        :key="onda"
        class="onda-clique absolute h-14 w-14 rounded-full border-[3px] border-white/90 bg-white/20 shadow-[0_0_18px_rgba(255,255,255,.55)]"
        :style="{ left: `${cursor.x - 28}px`, top: `${cursor.y - 28}px` }"
      ></span>
      <!-- cursor preto de contorno branco do CorelDRAW (seta com haste), redesenhado
           em vetor: fica nítido em qualquer tamanho -->
      <svg
        viewBox="0 0 15 24"
        class="absolute left-0 top-0 h-[27px] w-[17px] overflow-visible"
        :style="{
          transform: `translate(${cursor.x - 2}px, ${cursor.y - 2}px) scale(${apertado ? 0.72 : 1})`,
          transformOrigin: '2px 2px',
          visibility: cursor.visivel ? 'visible' : 'hidden',
          transition: cursor.instantaneo ? 'none' : apertado ? 'transform 90ms ease-out' : `transform ${cursor.ms}ms cubic-bezier(.45,0,.25,1)`,
        }"
      >
        <!-- surge com um "pulo" rápido (90 ms) na ponta da seta -->
        <path
          :key="vez"
          class="cursor-surge"
          d="M1 1v18.2l4.6-4.4 3.3 7.6 3-1.3-3.3-7.5h6.6z"
          fill="#000"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onBeforeUnmount } from "vue";
import { Settings } from "lucide-vue-next";
import { ICONES } from "../icones";
import { marcas } from "../marcas";
import { t } from "../i18n";

const props = defineProps({
  // script em que o cursor clica agora (null = nada)
  alvo: { type: String, default: null },
});
const emit = defineEmits(["clique", "clicou"]);

const janela = ref(null);
const hover = ref(null);
const apertado = ref(null);
const onda = ref(0);
const vez = ref(0);   // reinicia o pulo de entrada do cursor
const cursor = reactive({ x: -60, y: 400, visivel: false, instantaneo: true, ms: 700 });

let timers = [];
const depois = (ms, fn) => timers.push(setTimeout(fn, ms));
const limpar = () => { timers.forEach(clearTimeout); timers = []; };

// centro do quadrado do script, em px da janela (347x831)
function centro(nome) {
  const base = janela.value;
  const el = base && base.querySelector(`[data-tile="${nome}"]`);
  if (!el) return null;
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2, n = el;
  while (n && n !== base) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return { x, y };
}

watch(() => props.alvo, (nome) => {
  limpar();
  if (!nome) return;
  // no instante da pausa o cursor já está dentro do menu, no ponto marcado (em %)
  const x0 = (marcas.origem.x / 100) * 347;
  const y0 = (marcas.origem.y / 100) * 831;
  cursor.instantaneo = true;
  cursor.x = x0; cursor.y = y0; cursor.visivel = true; vez.value++;
  depois(16, () => {
    cursor.instantaneo = false;
    cursor.ms = 650;
    const c = centro(nome);
    if (c) { cursor.x = c.x; cursor.y = c.y; }
  });
  depois(700, () => { hover.value = nome; });
  depois(950, () => { apertado.value = nome; });
  depois(1140, () => { apertado.value = null; onda.value++; emit("clique"); });
  // sai pela borda esquerda (a borda corta), como se voltasse para o Corel
  depois(1400, () => { hover.value = null; cursor.ms = 500; cursor.x = -60; cursor.y = y0; });
  depois(1900, () => { cursor.visivel = false; emit("clicou"); });
});onBeforeUnmount(limpar);

const botoes = ["M0 5h10", "M.5.5h9v9h-9z", "M0 0l10 10M10 0 0 10"];
const scripts = [
  // C M Y K, igual ao app
  { nome: "Repassar", cor: "#00AEEF", icone: ICONES.repassar },
  { nome: "Uniforme", cor: "#EC008C", icone: ICONES.uniforme },
  { nome: "Organizar", cor: "#FFD200", icone: ICONES.organizar },
  { nome: "Exportar", cor: "#E5E7EB", icone: ICONES.exportar, preto: true },
];
</script>