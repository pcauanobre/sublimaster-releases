<template>
  <JanelaFlutuante>
    <div class="flex items-start gap-2">
      <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"><span class="h-3.5 w-3.5" v-html="ICONES.whats"></span></span>
      <div class="flex-1">
        <div class="flex items-center justify-between"><p class="text-[11px] font-medium">Coordenação Escola Sol</p><span class="text-[9px] text-muted">10:42</span></div>
        <p class="mt-0.5 rounded-lg rounded-tl-none bg-panel px-2 py-1.5 font-mono text-[9px] leading-relaxed text-ink/80">
          João Pedro 10 G<br />Ana Clara 7 M<br />Rafael 23 GG<br />… mais 43 nomes
        </p>
      </div>
    </div>
    <div class="mt-3 border-t border-line pt-2">
      <p class="mb-1.5 flex items-center gap-1 text-[10px] text-[#5E8A2E]"><span class="h-1.5 w-1.5 rounded-full bg-[#5E8A2E]"></span>Colado no Uniforme</p>
      <div
        v-for="(l, i) in linhas"
        :key="l.nome"
        class="mb-1 flex items-center justify-between rounded-md bg-panel px-2 py-1 text-[10px] opacity-0"
        :style="{ animation: `surge .4s ease ${0.3 + i * 0.18}s forwards` }"
      >
        <span>{{ l.nome }}</span><span class="text-muted">nº {{ l.n }} · {{ l.t }}</span>
      </div>
      <p class="mt-1.5 text-right text-[9px] text-muted">46 de 46 peças montadas</p>
    </div>
  </JanelaFlutuante>
</template>

<script setup>
import JanelaFlutuante from "./JanelaFlutuante.vue";
import { ICONES } from "../../icones";
const linhas = [
  { nome: "João Pedro", n: 10, t: "G" },
  { nome: "Ana Clara", n: 7, t: "M" },
  { nome: "Rafael", n: 23, t: "GG" },
];
</script>
