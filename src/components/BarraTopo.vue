<template>
  <header class="relative z-20 flex items-center justify-between px-5 pt-5 md:px-7 md:pt-6">
    <a href="#" class="flex animate-foca items-center gap-2 text-[15px] font-semibold tracking-tight text-white">
      <img src="/logo.png" alt="" class="h-7 w-7" />
      SubliMaster
    </a>

    <!-- pílula de ícones: um por script, o primeiro marcado -->
    <nav
      class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur md:flex"
      aria-label="Scripts"
    >
      <a
        v-for="(it, i) in itens"
        :key="it.nome"
        :href="`#${it.id}`"
        :title="it.nome"
        class="grid h-8 w-8 animate-flutua place-items-center rounded-full transition-colors"
        :class="i === 0 ? 'bg-white text-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'"
        :style="{ animationDelay: `${0.15 + i * 0.07}s` }"
      >
        <span class="h-4 w-4" v-html="it.icone"></span>
      </a>
    </nav>

    <a
      href="#teste"
      class="animate-foca rounded-full border border-azul/60 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-azul [animation-delay:.5s]"
    >
      Testar 7 dias
    </a>
  </header>
</template>

<script setup>
import { ICONES } from "../icones";

const itens = [
  { id: "inicio", nome: "Início", icone: ICONES.grade },
  { id: "recursos", nome: "Repassar", icone: ICONES.repassar },
  { id: "recursos", nome: "Uniforme", icone: ICONES.uniforme },
  { id: "recursos", nome: "Exportar", icone: ICONES.exportar },
  { id: "baixar", nome: "Baixar", icone: ICONES.baixar },
];
</script>
