<template>
  <div class="flex w-[min(100%,340px)] flex-col items-center gap-3">
    <!-- tela real do app -->
    <img src="/app-exportar.png" alt="Tela do Exportar com JPG, PNG e PDF" class="w-full rounded-[14px] shadow-[0_24px_50px_-20px_rgba(20,30,20,.5)]" />
    <div class="w-[88%] rounded-card bg-white/85 p-3 backdrop-blur-md shadow-[0_18px_40px_-20px_rgba(20,30,20,.45)]">
      <p class="mb-1.5 text-[10px] text-muted">Pasta do pedido</p>
      <div
        v-for="(a, i) in arquivos"
        :key="a"
        class="mb-1 flex items-center justify-between rounded-md bg-panel px-2 py-1 text-[10px] opacity-0"
        :style="{ animation: `surge .35s ease ${0.3 + i * 0.15}s forwards` }"
      >
        <span>{{ a }}</span><span class="text-[#5E8A2E]">300 DPI</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const arquivos = ["M FRENTE.jpg", "M COSTAS.jpg", "M MANGA ESQ.jpg", "M MANGA DIR.jpg"];
</script>
