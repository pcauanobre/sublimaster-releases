<template>
  <!-- janela do app flutuando sobre o fundo: barra de título do Windows e menu de scripts -->
  <div class="w-[min(100%,300px)] overflow-hidden rounded-[12px] border border-white/20 bg-white/90 shadow-[0_30px_60px_-20px_rgba(0,0,0,.55)] backdrop-blur-md">
    <BarraJanela class="border-b border-line" />
    <div class="p-3">
      <div class="mb-3 flex items-center gap-1">
        <span v-for="(ic, i) in barra" :key="i" class="grid h-6 w-6 place-items-center rounded-md" :class="i === 0 ? 'bg-azul text-white' : 'text-ink/60'">
          <span class="h-3 w-3" v-html="ic"></span>
        </span>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import BarraJanela from "../BarraJanela.vue";
import { ICONES } from "../../icones";
const barra = [ICONES.grade, ICONES.repassar, ICONES.uniforme, ICONES.exportar, ICONES.organizar];
</script>
