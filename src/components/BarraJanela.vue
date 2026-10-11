<template>
  <!-- barra de título de janela do Windows: ícone, nome e ─ ▢ ✕ -->
  <div class="flex h-8 items-center justify-between pl-3" :class="escura ? 'text-white/70' : 'text-ink/55'">
    <div class="flex min-w-0 items-center gap-2 text-[11px]">
      <img src="/logo.png" alt="" class="h-3.5 w-3.5" />
      <span class="truncate">{{ titulo }}</span>
    </div>
    <div class="flex h-full items-stretch">
      <span v-for="b in botoes" :key="b.nome" class="grid w-9 place-items-center" :title="b.nome">
        <svg viewBox="0 0 10 10" class="h-2.5 w-2.5" fill="none" stroke="currentColor" stroke-width="1"><path :d="b.d" /></svg>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: { type: String, default: "SubliMaster" },
  // texto claro sobre fundo escuro/vidro
  escura: { type: Boolean, default: false },
});

const botoes = [
  { nome: "Minimizar", d: "M0 5h10" },
  { nome: "Maximizar", d: "M.5.5h9v9h-9z" },
  { nome: "Fechar", d: "M0 0l10 10M10 0 0 10" },
];
</script>
