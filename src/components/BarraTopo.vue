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
        :key="it.chave"
        :href="`#${it.id}`"
        :title="it.nome()"
        class="grid h-8 w-8 animate-flutua place-items-center rounded-full transition-colors"
        :class="i === 0 ? 'bg-white text-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'"
        :style="{ animationDelay: `${0.15 + i * 0.07}s` }"
      >
        <span class="h-4 w-4" v-html="it.icone"></span>
      </a>
    </nav>
    <!-- troca de idioma (o padrão vem do navegador) -->
    <button
      class="animate-foca rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/85 transition hover:bg-white/10 [animation-delay:.5s]"
      @click="alternarIdioma"
    >
      {{ t("idioma") }}
    </button>
  </header>
</template>

<script setup>
import { ICONES } from "../icones";
import { t, alternarIdioma } from "../i18n";

const itens = [
  { chave: "inicio", id: "inicio", nome: () => t("nav.inicio"), icone: ICONES.grade },
  { chave: "Repassar", id: "recursos", nome: () => t("scripts.Repassar"), icone: ICONES.repassar },
  { chave: "Uniforme", id: "recursos", nome: () => t("scripts.Uniforme"), icone: ICONES.uniforme },
  { chave: "Exportar", id: "recursos", nome: () => t("scripts.Exportar"), icone: ICONES.exportar },
  { chave: "baixar", id: "baixar", nome: () => t("nav.baixar"), icone: ICONES.baixar },
];
</script>
