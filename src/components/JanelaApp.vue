<template>
  <!-- Menu do SubliMaster igual à tela real do app (347 x 831). Quem usa reduz com transform. -->
  <div class="flex h-[831px] w-[347px] flex-col overflow-hidden bg-[radial-gradient(120%_60%_at_50%_0%,#1a2540_0%,#0f172a_55%)] text-white">
    <!-- barra de título do Windows -->
    <div class="flex h-[30px] shrink-0 items-center justify-between bg-black pl-2 text-[12px] text-white">
      <span class="flex items-center gap-2"><img src="/logo.png" alt="" class="h-4 w-4" />SubliMaster</span>
      <span class="flex h-full text-white/80">
        <span v-for="(b, i) in botoes" :key="b" class="grid w-[46px] place-items-center" :class="i === 1 ? 'text-white/35' : ''">
          <svg viewBox="0 0 10 10" class="h-2.5 w-2.5" fill="none" stroke="currentColor"><path :d="b" /></svg>
        </span>
      </span>
    </div>

    <div class="relative flex flex-1 flex-col items-center px-[22px]">
      <span class="absolute right-[13px] top-[12px] grid h-[32px] w-[32px] place-items-center rounded-[8px] border border-white/15 bg-white/5 text-white/85">
        <Settings :size="17" />
      </span>

      <img src="/logo.png" alt="" class="mt-[72px] h-[78px] w-[78px]" />
      <p class="mt-[6px] text-[22px] font-bold tracking-tight">SubliMaster</p>

      <!-- scripts em uma coluna, como no app com 4 itens -->
      <div class="mt-[19px] flex w-[150px] flex-col gap-[8px]">
        <div
          v-for="s in scripts"
          :key="s.nome"
          class="flex h-[92px] flex-col items-center justify-center gap-[10px] rounded-[14px] border border-white/10 bg-[#1e293b]"
        >
          <span class="grid h-[38px] w-[38px] place-items-center rounded-[9px]" :style="{ background: `${s.cor}2e`, color: s.cor }">
            <span class="h-[20px] w-[20px]" v-html="s.icone"></span>
          </span>
          <span class="text-[13px] font-bold">{{ s.nome }}</span>
        </div>
      </div>

      <div class="mt-[14px] grid h-[42px] w-full place-items-center rounded-[10px] bg-[#ef4444] text-[15px] font-bold">Parar Scripts</div>
      <div class="mt-[8px] grid h-[36px] w-full place-items-center rounded-[8px] border border-white/15 text-[13px] font-bold">Minimizar para Bandeja</div>
      <p class="mt-[14px] text-[13px] font-bold text-white/55">Pedro · v1.0.55</p>
      <p class="mt-[6px] text-[11px] text-white/45">© 2026 SubliMaster. Todos os direitos reservados</p>
      <p class="mt-[6px] text-[12px] font-bold">Licença vitalícia</p>
    </div>
  </div>
</template>

<script setup>
import { Settings } from "lucide-vue-next";
import { ICONES } from "../icones";

const botoes = ["M0 5h10", "M.5.5h9v9h-9z", "M0 0l10 10M10 0 0 10"];
const scripts = [
  { nome: "Repassar", cor: "#60a5fa", icone: ICONES.repassar },
  { nome: "Uniforme", cor: "#facc15", icone: ICONES.uniforme },
  { nome: "Exportar", cor: "#34d399", icone: ICONES.exportar },
  { nome: "Organizar", cor: "#f472b6", icone: ICONES.organizar },
];
</script>
