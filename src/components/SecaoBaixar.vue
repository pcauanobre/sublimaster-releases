<template>
  <section id="baixar" class="px-2 pt-2 md:px-3 md:pt-3">
    <!-- como instalar: título à esquerda, três passos à direita -->
    <div v-aparecer class="rounded-frame bg-panel p-6 md:p-10">
      <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
        <div class="flex flex-col">
          <span v-aparecer="120" class="font-mono text-[11px] uppercase tracking-wider text-muted">Download</span>
          <h2 v-aparecer.foca="200" class="mt-2 font-display text-[40px] leading-none md:text-[52px]">
            Instala<br /><span class="text-azul">em um minuto</span>
          </h2>
          <p v-aparecer="300" class="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-ink/60">
            Baixe, abra o instalador e entre com a sua chave.
          </p>
          <button
            v-aparecer="380"
            class="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] font-medium text-white transition hover:-translate-y-px hover:bg-azul md:mt-auto"
            @click="baixar"
          >
            Baixar SubliMaster<span class="h-4 w-4" v-html="ICONES.seta"></span>
          </button>
        </div>

        <ol class="grid gap-2 md:grid-cols-3 md:gap-3">
          <li
            v-for="(p, i) in passos"
            :key="p.titulo"
            v-aparecer="250 + i * 120"
            class="group flex flex-col rounded-card bg-white p-5 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(11,18,34,.35)]"
          >
            <div class="flex items-center justify-between">
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-azul/10 text-azul transition-colors group-hover:bg-azul group-hover:text-white">
                <span class="h-5 w-5" v-html="p.icone"></span>
              </span>
              <span class="font-mono text-[12px] text-ink/35">0{{ i + 1 }}</span>
            </div>
            <h3 class="mt-6 text-[16px] font-medium md:mt-16">{{ p.titulo }}</h3>
            <p class="mt-1.5 text-[13px] leading-relaxed text-ink/60">{{ p.texto }}</p>
          </li>
        </ol>
      </div>
    </div>

    <!-- chamada final: o mesmo fundo escuro do topo -->
    <div id="teste" v-aparecer class="relative mt-2 overflow-hidden rounded-frame text-white md:mt-3">
      <FundoPixel />
      <div class="relative z-10 mx-auto flex max-w-[760px] flex-col items-center px-5 py-20 text-center md:py-28">
        <span v-aparecer="120" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/80 backdrop-blur">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-azul"></span>
          7 dias grátis, sem cartão
        </span>
        <h2 v-aparecer.foca="220" class="mt-5 font-display text-[40px] leading-[1.02] md:text-[64px]">
          Teste 7 dias<br /><span class="text-azul-claro">com os seus moldes</span>
        </h2>
        <p v-aparecer="340" class="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-white/60">
          Me chama no WhatsApp com o nome da loja e a versão do seu Corel. A chave de teste chega no mesmo dia, sem cartão.
        </p>

        <div v-aparecer="440" class="mt-8 grid w-full max-w-[460px] grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-azul px-5 py-3 text-[14px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,.8)] transition hover:-translate-y-px hover:bg-[#2563EB]"
            @click="baixar"
          >
            Baixar para Windows<span class="h-4 w-4" v-html="ICONES.seta"></span>
          </button>
          <a
            :href="zap('Oi! Quero testar o SubliMaster por 7 dias. Minha loja é ___ e uso o CorelDRAW ___.')"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-medium text-ink transition hover:-translate-y-px"
          >
            <span class="h-4 w-4 text-[#25D366]" v-html="ICONES.whats"></span>Pedir a chave de teste
          </a>
        </div>

        <!-- requisitos em etiquetas -->
        <ul class="mt-10 flex flex-wrap justify-center gap-2">
          <li
            v-for="(r, i) in requisitos"
            :key="r"
            v-aparecer="560 + i * 80"
            class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/70"
          >
            <span class="h-3.5 w-3.5 text-azul-claro" v-html="ICONES.check"></span>{{ r }}
          </li>
        </ul>
        <p v-aparecer="800" class="mt-4 font-mono text-[11px] text-white/35">versão {{ versao }} · 27 MB</p>
      </div>
    </div>

    <footer v-aparecer class="flex flex-col items-center justify-between gap-3 px-3 py-6 text-[12px] text-muted md:flex-row">
      <span class="flex items-center gap-2 text-ink"><img src="/logo.png" alt="" class="h-5 w-5" />SubliMaster</span>
      <span>© 2026 SubliMaster. Todos os direitos reservados.</span>
      <a :href="zap('Oi, vi o site do SubliMaster')" target="_blank" rel="noopener" class="hover:text-ink">WhatsApp</a>
    </footer>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import FundoPixel from "./FundoPixel.vue";
import { baixar, zap, versao, carregarVersao } from "../links";
import { ICONES } from "../icones";

const passos = [
  { titulo: "Baixe", texto: "O instalador para Windows, direto do site.", icone: ICONES.baixar },
  {
    titulo: "Abra o instalador",
    texto: "Na primeira vez o Windows mostra um aviso azul. Dois cliques e pronto.",
    icone: ICONES.organizar,
  },
  {
    titulo: "Entre com a sua chave",
    texto: "Vale em qualquer computador, um por vez: formatou ou trocou de máquina, é só entrar de novo.",
    icone: ICONES.repassar,
  },
];

const requisitos = ["Windows 10 ou 11, 64 bits", "CorelDRAW 2020 a 2026", "Sem macro, VBA ou plugin no Corel"];

onMounted(carregarVersao);
</script>
