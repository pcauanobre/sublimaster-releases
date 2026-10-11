<template>
  <!-- Fundo escuro no navy do app: grade fina, quadradinhos acesos piscando
       devagar e brilho azul nos cantos de baixo. -->
  <div class="grao absolute inset-0 overflow-hidden bg-noite" aria-hidden="true">
    <div class="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#16233F_0%,#0B1222_60%)]"></div>

    <!-- grade: some nas bordas -->
    <div
      class="absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_70%_at_50%_40%,#000_30%,transparent_100%)]"
      :style="{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
        backgroundSize: `${CELULA}px ${CELULA}px`,
        backgroundPosition: 'center top',
      }"
    ></div>

    <!-- quadradinhos acesos, em dois grupos como na referência -->
    <div class="absolute inset-0 [mask-image:radial-gradient(85%_75%_at_50%_40%,#000_35%,transparent_100%)]">
      <span
        v-for="(p, i) in pixels"
        :key="i"
        class="absolute animate-pisca bg-azul"
        :style="{
          left: `calc(50% + ${p.x * CELULA}px)`,
          top: `${p.y * CELULA}px`,
          width: `${CELULA - 1}px`,
          height: `${CELULA - 1}px`,
          animationDelay: `${p.d}s`,
          animationDuration: `${p.t}s`,
          filter: `opacity(${p.o * 1.6})`,
        }"
      ></span>
    </div>

    <!-- brilho azul -->
    <div
      class="absolute -bottom-[25%] -left-[12%] h-[70%] w-[45%] animate-deriva1 rounded-full bg-azul opacity-90 blur-[110px] will-change-transform"
      :class="glow === 'centro' ? 'hidden' : ''"
    ></div>
    <div
      class="absolute -bottom-[25%] -right-[12%] h-[70%] w-[45%] animate-deriva2 rounded-full bg-[#2563EB] opacity-90 blur-[110px] will-change-transform"
      :class="glow === 'centro' ? 'hidden' : ''"
    ></div>
    <div
      v-if="glow === 'centro'"
      class="absolute -bottom-[35%] -right-[15%] h-[70%] w-[50%] animate-deriva1 rounded-full bg-azul blur-[120px] will-change-transform"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  // "cantos" no topo, "centro" nos painéis menores
  glow: { type: String, default: "cantos" },
});

const CELULA = 64;

// posição em células a partir do centro (x) e do topo (y); o = intensidade
const pixels = [
  { x: -7, y: 2, o: 0.1 }, { x: -6, y: 2, o: 0.06 }, { x: -6, y: 3, o: 0.14 }, { x: -5, y: 4, o: 0.08 },
  { x: -7, y: 5, o: 0.05 }, { x: -8, y: 3, o: 0.07 }, { x: -5, y: 6, o: 0.1 }, { x: -9, y: 6, o: 0.05 },
  { x: 4, y: 2, o: 0.09 }, { x: 5, y: 2, o: 0.14 }, { x: 6, y: 3, o: 0.06 }, { x: 5, y: 4, o: 0.11 },
  { x: 7, y: 4, o: 0.07 }, { x: 4, y: 5, o: 0.05 }, { x: 6, y: 6, o: 0.12 }, { x: 8, y: 2, o: 0.05 },
  { x: 3, y: 7, o: 0.06 }, { x: -4, y: 8, o: 0.06 }, { x: 7, y: 8, o: 0.08 }, { x: -2, y: 1, o: 0.04 },
].map((p, i) => ({ ...p, d: -((i * 1.7) % 6), t: 5 + (i % 4) * 1.5 }));
</script>
