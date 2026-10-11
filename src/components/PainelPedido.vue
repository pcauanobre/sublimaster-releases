<template>
  <!-- O card que sobe por cima do morro: um "painel do dia" da estamparia,
       no lugar do CRM do layout de referência. -->
  <div class="w-full rounded-card bg-white/95 p-3 shadow-[0_30px_60px_-20px_rgba(20,30,20,.35)] backdrop-blur md:p-4">
    <div class="grid grid-cols-1 gap-3 md:grid-cols-[1.1fr_auto_1.3fr]">
      <!-- números -->
      <div class="animate-flutua rounded-[14px] bg-panel p-3 [animation-delay:1.85s]">
        <div class="flex items-center justify-between text-[10px] text-muted"><span>Peças no pedido</span><span>46</span></div>
        <div class="mt-2 flex items-end gap-5">
          <div><p class="text-[26px] font-medium leading-none text-[#5E8A2E]">46</p><p class="mt-1 text-[9px] text-muted">montadas</p></div>
          <div><p class="text-[26px] font-medium leading-none">8</p><p class="mt-1 text-[9px] text-muted">tamanhos</p></div>
          <div><p class="text-[26px] font-medium leading-none">4s</p><p class="mt-1 text-[9px] text-muted">repasse</p></div>
        </div>
        <div class="mt-4 text-[10px] text-muted">Tempo poupado hoje</div>
        <p class="mt-1 text-[28px] font-medium leading-none tracking-tight">3h 40min</p>
      </div>

      <!-- quem fez o quê: os quatro scripts -->
      <div class="hidden animate-flutua flex-col items-center gap-2 rounded-[14px] bg-panel p-2 [animation-delay:1.95s] md:flex">
        <span
          v-for="(s, i) in scripts"
          :key="s.nome"
          class="grid h-7 w-7 animate-flutua place-items-center rounded-full text-white"
          :style="{ background: s.cor, animationDelay: `${2.1 + i * 0.08}s` }"
          :title="s.nome"
        >
          <span class="h-3.5 w-3.5" v-html="s.icone"></span>
        </span>
      </div>

      <!-- a lista que chegou no WhatsApp -->
      <div class="animate-flutua rounded-[14px] bg-panel p-3 [animation-delay:2.05s]">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-medium">Lista do cliente</p>
          <span class="h-3 w-3 text-[#25D366]" v-html="ICONES.whats"></span>
        </div>
        <p class="mt-1 text-[9px] text-muted">colada do WhatsApp, 46 linhas</p>
        <ul class="mt-2 space-y-1">
          <li v-for="(l, i) in lista" :key="l.n" class="flex animate-foca items-center justify-between rounded-md bg-white px-2 py-1 text-[10px]" :style="{ animationDelay: `${2.3 + i * 0.12}s` }">
            <span>{{ l.nome }}</span><span class="text-muted">{{ l.n }} · {{ l.t }}</span>
          </li>
        </ul>
        <div class="mt-2 flex items-center gap-1 text-[9px] text-[#5E8A2E]"><span class="h-1.5 w-1.5 rounded-full bg-[#5E8A2E]"></span>Uniforme montou tudo</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ICONES } from "../icones";

const scripts = [
  { nome: "Repassar", cor: "#3B82F6", icone: ICONES.repassar },
  { nome: "Uniforme", cor: "#D9A400", icone: ICONES.uniforme },
  { nome: "Exportar", cor: "#2F9E6F", icone: ICONES.exportar },
  { nome: "Organizar", cor: "#E0458A", icone: ICONES.organizar },
];

const lista = [
  { nome: "João Pedro", n: 10, t: "G" },
  { nome: "Ana Clara", n: 7, t: "M" },
  { nome: "Rafael", n: 23, t: "GG" },
];
</script>
