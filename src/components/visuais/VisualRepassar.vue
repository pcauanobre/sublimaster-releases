<template>
  <JanelaFlutuante>
    <p class="text-[11px] font-medium">Repassar · Camisa Escola Sol</p>
    <p class="text-[9px] text-muted">arte acertada no M</p>
    <div class="mt-3 grid grid-cols-4 gap-1.5">
      <div
        v-for="(t, i) in tamanhos"
        :key="t"
        class="flex items-center justify-between rounded-md px-2 py-1.5 text-[10px] opacity-0"
        :class="t === 'M' ? 'bg-ink text-white' : 'bg-panel'"
        :style="{ animation: `surge .4s ease ${0.25 + i * 0.12}s forwards` }"
      >
        <span>{{ t }}</span>
        <span class="text-[#5E8A2E]" :class="t === 'M' ? 'text-white/70' : ''">✓</span>
      </div>
    </div>
    <p class="mt-3 text-[9px] text-muted">8 tamanhos em 4 s · texto centralizado</p>
  </JanelaFlutuante>
</template>

<script setup>
import JanelaFlutuante from "./JanelaFlutuante.vue";
const tamanhos = ["PP", "P", "M", "G", "GG", "XG", "XG2", "XG3"];
</script>
