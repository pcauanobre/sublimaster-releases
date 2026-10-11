<template>
  <!-- Céu e morro desenhados em código: fazem o papel da foto do layout de
       referência sem usar imagem de ninguém. `variante` muda o recorte. -->
  <div class="grao absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0" :style="{ background: ceu }"></div>

    <!-- nuvens: manchas claras e desfocadas, andando bem devagar -->
    <div class="absolute inset-[-10%] animate-nuvem">
      <span
        v-for="(n, i) in nuvens"
        :key="i"
        class="absolute rounded-full bg-white"
        :style="{ left: n.x, top: n.y, width: n.w, height: n.h, opacity: n.o, filter: `blur(${n.b}px)` }"
      ></span>
    </div>

    <!-- foto de verdade, quando existir em public/: cobre o desenho -->
    <img
      v-if="foto && !semFoto"
      :src="foto"
      alt=""
      class="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(.16,1,.3,1)]"
      :style="{ objectPosition: posicao }"
      :class="fotoPronta ? 'scale-100 opacity-100' : 'scale-105 opacity-0'"
      @load="fotoPronta = true"
      @error="semFoto = true"
    />

    <!-- morro / pedra -->
    <svg
      v-if="chao && !fotoPronta"
      class="absolute inset-x-0 bottom-0 w-full"
      :class="variante === 'pedra' ? 'h-[55%]' : 'h-[42%]'"
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="`grama-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9DBF5C" />
          <stop offset=".45" stop-color="#6E9A3A" />
          <stop offset="1" stop-color="#3F6B22" />
        </linearGradient>
        <linearGradient :id="`pedra-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#D9D6CD" />
          <stop offset=".6" stop-color="#A9A59A" />
          <stop offset="1" stop-color="#77736A" />
        </linearGradient>
        <filter :id="`folhas-${uid}`">
          <feTurbulence type="fractalNoise" baseFrequency=".02 .9" numOctaves="3" result="r" />
          <feColorMatrix in="r" type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 .55" /></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      <template v-if="variante === 'pedra'">
        <path :fill="`url(#grama-${uid})`" :filter="`url(#folhas-${uid})`" d="M0 250 C 200 230 380 215 600 225 C 820 235 1000 220 1200 210 L1200 400 L0 400Z" />
        <path :fill="`url(#pedra-${uid})`" d="M300 255 C 360 190 520 165 720 175 C 860 182 960 205 1010 240 C 960 262 820 268 640 266 C 480 264 360 268 300 255Z" />
        <path fill="#5E5A52" opacity=".35" d="M330 252 C 480 258 760 262 1000 240 C 980 256 860 270 640 271 C 470 272 360 266 330 252Z" />
        <path :fill="`url(#grama-${uid})`" opacity=".9" d="M0 300 C 260 280 520 290 760 282 C 940 276 1080 290 1200 280 L1200 400 L0 400Z" />
      </template>
      <template v-else>
        <path :fill="`url(#grama-${uid})`" :filter="`url(#folhas-${uid})`" d="M0 330 C 160 300 320 210 560 170 C 780 135 1000 175 1200 230 L1200 400 L0 400Z" />
        <path :fill="`url(#grama-${uid})`" opacity=".85" d="M0 360 C 240 330 520 300 800 305 C 980 308 1100 330 1200 345 L1200 400 L0 400Z" />
      </template>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  // "morro" no hero, "pedra" no painel das abas, "so-ceu" na faixa do título
  variante: { type: String, default: "morro" },
  // caminho da foto em public/; se não existir, fica o desenho
  foto: { type: String, default: "" },
  // qual parte da foto fica à mostra quando a tela corta (celular)
  posicao: { type: String, default: "72% 50%" },
});

const fotoPronta = ref(false);
const semFoto = ref(false);

const uid = Math.random().toString(36).slice(2, 8);
const chao = computed(() => props.variante !== "so-ceu");

const ceu = computed(() =>
  "linear-gradient(180deg, #8FB7D3 0%, #A9C9DE 38%, #CBDDE8 70%, #E2ECF1 100%)"
);

const nuvens = [
  { x: "4%", y: "10%", w: "38%", h: "16%", o: 0.55, b: 38 },
  { x: "40%", y: "4%", w: "30%", h: "12%", o: 0.45, b: 34 },
  { x: "62%", y: "16%", w: "40%", h: "18%", o: 0.5, b: 44 },
  { x: "18%", y: "30%", w: "26%", h: "10%", o: 0.35, b: 30 },
  { x: "70%", y: "38%", w: "24%", h: "9%", o: 0.3, b: 28 },
];
</script>
