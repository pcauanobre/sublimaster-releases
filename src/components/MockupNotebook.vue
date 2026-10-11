<template>
  <!-- Notebook com a gravação real do Corel em loop e a janela do SubliMaster
       ao lado. Tudo desenhado em código num palco de tamanho
       fixo, que é reduzido por inteiro para caber na largura disponível. -->
  <div ref="moldura" class="relative w-full" :style="{ height: `${ALTURA * escala}px` }">
    <div
      class="absolute left-1/2 top-0 origin-top"
      :style="{ width: `${LARGURA}px`, height: `${ALTURA}px`, transform: `translateX(-50%) scale(${escala})` }"
    >
      <!-- notebook (genérico, Windows) com a gravação real do Corel em loop -->
      <div class="absolute left-[10px] top-[40px] w-[720px] animate-sobe [perspective:1800px]">
        <div>
        <div class="rounded-t-[18px] border border-white/10 bg-[#0b0d12] p-[8px] pb-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
          <span class="mx-auto mb-[4px] block h-[4px] w-[4px] rounded-full bg-white/15"></span>
          <div class="relative aspect-video overflow-hidden rounded-[4px] bg-black">
            <video
              class="h-full w-full object-cover"
              src="/demo-corel.mp4"
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
              aria-label="Gravação do SubliMaster repassando a arte no CorelDRAW"
            ></video>
          </div>
        </div>
        <!-- base: teclado visto de frente, sem a cara de MacBook -->
        <div class="relative mx-[-40px] h-[20px] rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#454b58] via-[#2a2e37] to-[#15171d] shadow-[0_30px_50px_-20px_rgba(0,0,0,.8)]">
          <span class="absolute inset-x-[40px] top-0 h-px bg-white/20"></span>
          <span class="absolute left-1/2 top-[3px] h-[5px] w-[110px] -translate-x-1/2 rounded-full bg-black/40"></span>
        </div>
        </div>
      </div>
      <!-- app no tamanho real (347x831) reduzido, reto, com um brilho azul girando em volta -->
      <div class="absolute right-[18px] top-[10px] h-[482px] w-[201px] animate-janela [animation-delay:.4s]">
        <div class="relative" style="transform: scale(.58); transform-origin: 0 0; width: 347px; height: 831px">
          <!-- brilho azul (luz desfocada, sem linha) correndo pela borda, mesma velocidade em todo o caminho -->
          <svg class="pointer-events-none absolute left-[-6px] top-[-6px] overflow-visible" width="359" height="843" aria-hidden="true">
            <rect x="4" y="4" width="351" height="835" rx="12" class="borda-corre" />
          </svg>
          <div class="relative overflow-hidden rounded-[10px] shadow-[0_40px_70px_-20px_rgba(0,0,0,.85)]">
            <JanelaApp />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import JanelaApp from "./JanelaApp.vue";

const props = defineProps({
  // script em destaque na janela do SubliMaster (acompanha a aba ativa)
  ativo: { type: String, default: "Uniforme" },
});
// palco desenhado nesse tamanho e reduzido por inteiro
const LARGURA = 960;
const ALTURA = 500;

const moldura = ref(null);
const escala = ref(1);
let obs = null;
const medir = () => {
  if (!moldura.value) return;
  // cabe na largura e na altura do quadro (descontando o respiro de cima e de baixo)
  const pai = moldura.value.parentElement;
  const alturaLivre = pai ? pai.clientHeight - 48 : Infinity;
  escala.value = Math.min(1, moldura.value.clientWidth / LARGURA, alturaLivre / ALTURA);
};
onMounted(() => {
  medir();
  obs = new ResizeObserver(medir);
  obs.observe(moldura.value);
  if (moldura.value.parentElement) obs.observe(moldura.value.parentElement);
});
onBeforeUnmount(() => obs && obs.disconnect());

</script>
