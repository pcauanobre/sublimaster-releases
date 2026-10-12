<template>
  <!-- uma linha "Manual" ou "Com o SubliMaster": ícone, rótulo, valor e barra -->
  <div>
    <div class="flex items-center justify-between" :class="subli ? 'text-[13px] font-semibold text-azul' : 'text-[13px] text-ink/70'">
      <span class="flex items-center gap-1.5">
        <img v-if="subli" src="/logo.png" alt="" class="h-5 w-5" />
        <Hand v-else :size="15" :stroke-width="2" />
        {{ subli ? t("calc.subli") : t("calc.manual") }}
      </span>
      <span class="font-mono" :class="subli ? '' : 'text-ink/70'">{{ valor }}</span>
    </div>
    <div class="mt-1.5 rounded-full bg-[#EEF2F8]" :class="subli ? 'h-4' : 'h-2.5'">
      <div
        class="g-barra-h h-full rounded-full transition-[width] duration-300 ease-out"
        :class="subli ? 'g-listrada bg-azul shadow-[0_6px_16px_-6px_rgba(59,130,246,.8)]' : 'bg-[#A9BEDF]'"
        :style="{ width: `${Math.max(3, Math.min(100, largura))}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Hand } from "lucide-vue-next";
import { t } from "../i18n";

const props = defineProps({
  lado: { type: String, required: true }, // "manual" | "subli"
  valor: { type: String, required: true },
  largura: { type: Number, default: 100 }, // % da barra, proporcional de verdade
});
const subli = computed(() => props.lado === "subli");
</script>
