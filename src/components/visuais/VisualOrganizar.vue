<template>
  <JanelaFlutuante>
    <div class="flex items-center justify-between">
      <p class="text-[11px] font-medium">Folha 1,78 m</p>
      <span class="text-[9px] text-muted">14 peças · 141 ms</span>
    </div>
    <!-- a folha: peças caindo no lugar, da mais alta pra mais baixa -->
    <div class="relative mt-3 h-[150px] rounded-md border border-dashed border-ink/25 bg-panel">
      <span
        v-for="(p, i) in pecas"
        :key="i"
        class="absolute rounded-[3px] opacity-0"
        :style="{ left: p.x + '%', top: p.y + '%', width: p.w + '%', height: p.h + '%', background: p.c,
                  animation: `flutua .45s cubic-bezier(.2,.8,.2,1) ${0.25 + i * 0.08}s forwards` }"
      ></span>
    </div>
    <p class="mt-2 text-[9px] text-muted">Espaço 2 mm · margem 2 mm · aproveitando os vãos</p>
  </JanelaFlutuante>
</template>

<script setup>
import JanelaFlutuante from "./JanelaFlutuante.vue";
const az = "#3B82F6", am = "#D9A400", vd = "#2F9E6F", rs = "#E0458A";
const pecas = [
  { x: 3, y: 5, w: 22, h: 52, c: az }, { x: 27, y: 5, w: 22, h: 52, c: az },
  { x: 51, y: 5, w: 23, h: 54, c: rs }, { x: 76, y: 5, w: 21, h: 54, c: rs },
  { x: 3, y: 61, w: 18, h: 16, c: am }, { x: 23, y: 61, w: 18, h: 16, c: am },
  { x: 43, y: 63, w: 18, h: 16, c: vd }, { x: 63, y: 63, w: 18, h: 16, c: vd },
  { x: 3, y: 80, w: 18, h: 15, c: am }, { x: 23, y: 80, w: 18, h: 15, c: am },
  { x: 43, y: 82, w: 15, h: 13, c: vd }, { x: 60, y: 82, w: 15, h: 13, c: vd },
  { x: 83, y: 63, w: 14, h: 15, c: az }, { x: 83, y: 81, w: 14, h: 14, c: az },
];
</script>
