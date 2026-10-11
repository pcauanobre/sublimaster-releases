<template>
  <!-- Calculadora em três cartões. Cada um tem uma ideia só: pergunta,
       slider, quanto rende no "Manual" x "Com o SubliMaster" e o resultado grande. -->
  <section id="resultados" class="px-2 pt-2 md:px-3 md:pt-3">
    <div class="rounded-frame bg-white px-4 py-12 md:px-10 md:py-20">
      <div class="mx-auto max-w-[640px] text-center">
        <span v-aparecer class="font-mono text-[11px] uppercase tracking-wider text-muted">Faça a conta</span>
        <h2 v-aparecer.foca="120" class="mt-3 font-display text-[34px] leading-[1.02] md:text-[48px]">
          O que muda <span class="text-azul">na sua semana</span>
        </h2>
        <p v-aparecer="200" class="mt-3 text-[15px] text-ink/55">Arraste e veja com os seus números.</p>
      </div>

      <div class="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
        <article
          v-for="(c, i) in cartoes"
          :key="c.id"
          v-aparecer="i * 120"
          class="grafico flex flex-col rounded-[22px] border border-line bg-white p-6 transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(11,18,34,.35)] md:p-7"
        >
          <!-- rótulo + pergunta -->
          <div class="flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-azul/10 text-azul">
              <component :is="c.icone" :size="16" :stroke-width="2" />
            </span>
            <span class="text-[13px] font-medium">{{ c.rotulo }}</span>
          </div>
          <p class="mt-4 min-h-[2.8em] text-[14px] leading-snug text-ink/60">{{ c.pergunta }}</p>

          <!-- valor escolhido -->
          <div class="mt-4 flex items-baseline justify-between">
            <span class="font-display text-[32px] leading-none">{{ c.valorEscolhido }}</span>
          </div>

          <input
            :id="`faixa-${c.id}`"
            v-model.number="c.modelo.value"
            type="range"
            :min="c.min"
            :max="c.max"
            :step="c.passo"
            :aria-label="c.pergunta"
            class="faixa mt-4"
            :style="{ '--cheio': `${((c.modelo.value - c.min) / (c.max - c.min)) * 100}%` }"
          />

          <!-- comparação: mede o quanto rende, então quem rende mais tem a barra maior -->
          <div class="mt-7 space-y-4">
            <LinhaComparacao lado="manual" :valor="c.manual" :largura="c.larguraManual" />
            <LinhaComparacao lado="subli" :valor="c.subli" :largura="c.larguraSubli" />
          </div>

          <!-- resultado -->
          <div class="mt-7 border-t border-line pt-5">
            <p class="font-display text-[40px] leading-none text-azul">{{ c.resultado }}</p>
            <p class="mt-2 text-[14px] text-ink/70">{{ c.legenda }}</p>
          </div>

        </article>
      </div>

      <p v-aparecer="300" class="mt-8 text-center text-[11px] text-muted">Estimativa: SubliMaster leva uns 3 min por pedido; folha 78% aproveitada no manual e 92% com o Organizar, a R$ 3,50 o metro.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { Clock, CalendarDays, Scroll } from "lucide-vue-next";
import LinhaComparacao from "./LinhaComparacao.vue";
import {
  useCalculadora, useNumeroSuave,
  MIN_COM_SUBLIMASTER, HORAS_POR_DIA, APROVEITAMENTO_ANTES, APROVEITAMENTO_DEPOIS, CUSTO_METRO,
} from "../composables/useCalculadora";

const {
  minutosNoBraco, pedidosPorSemana, metrosPorSemana,
  minutosPoupados, horasNoMes, diasNoMes, reaisPorMes,
} = useCalculadora();

// números do resultado correm até o valor novo
const poupadosSuave = useNumeroSuave(minutosPoupados);
const horasSuave = useNumeroSuave(horasNoMes);
const reaisSuave = useNumeroSuave(reaisPorMes);

const formatarMin = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}` : `${m} min`);
const formatarNum = (v) => Math.round(v).toLocaleString("pt-BR");
const pct = (v) => `${Math.round(v * 100)}%`;
const formatarDec = (v) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

const cartoes = computed(() => [
  {
    id: "tempo",
    icone: Clock,
    rotulo: "Tempo por pedido",
    pergunta: "Quanto tempo você leva para montar o arquivo de um conjunto esportivo de 20 peças?",
    modelo: minutosNoBraco, min: 5, max: 60, passo: 5,
    valorEscolhido: formatarMin(minutosNoBraco.value),
    unidade: "por pedido",
    // pedidos por hora: 60 min / tempo de cada um
    medida: "Pedidos por hora",
    manual: `${formatarDec(60 / minutosNoBraco.value)} por hora`,
    subli: `${formatarDec(60 / MIN_COM_SUBLIMASTER)} por hora`,
    larguraManual: (MIN_COM_SUBLIMASTER / minutosNoBraco.value) * 100,
    larguraSubli: 100,
    resultado: formatarMin(Math.round(poupadosSuave.value)),
    legenda: "a menos em cada pedido",
    premissa: `Com o SubliMaster: uns ${MIN_COM_SUBLIMASTER} min para colar a lista, conferir e exportar.`,
  },
  {
    id: "pedidos",
    icone: CalendarDays,
    rotulo: "Horas no mês",
    pergunta: "Quantos pedidos desse tamanho você faz por semana?",
    modelo: pedidosPorSemana, min: 1, max: 40, passo: 1,
    valorEscolhido: String(pedidosPorSemana.value),
    unidade: "pedidos por semana",
    // no mesmo tempo que hoje vai pra esses pedidos, quantos daria pra fazer
    medida: "Pedidos na semana, no mesmo tempo",
    manual: `${pedidosPorSemana.value} pedidos`,
    subli: `${formatarNum((pedidosPorSemana.value * minutosNoBraco.value) / MIN_COM_SUBLIMASTER)} pedidos`,
    larguraManual: (MIN_COM_SUBLIMASTER / minutosNoBraco.value) * 100,
    larguraSubli: 100,
    resultado: `${formatarNum(horasSuave.value)}h`,
    legenda: "livres por mês",
    premissa: `Usa o tempo do primeiro cartão e dias de ${HORAS_POR_DIA}h.`,
  },
  {
    id: "papel",
    icone: Scroll,
    rotulo: "Papel e tinta",
    pergunta: "Quantos metros de papel você imprime por semana?",
    modelo: metrosPorSemana, min: 10, max: 500, passo: 10,
    valorEscolhido: `${metrosPorSemana.value} m`,
    unidade: "por semana",
    medida: "Folha aproveitada",
    manual: pct(APROVEITAMENTO_ANTES),
    subli: pct(APROVEITAMENTO_DEPOIS),
    larguraManual: APROVEITAMENTO_ANTES * 100,
    larguraSubli: APROVEITAMENTO_DEPOIS * 100,
    resultado: `R$ ${formatarNum(reaisSuave.value)}`,
    legenda: "a menos por mês em papel e tinta",
    premissa: `Folha ${pct(APROVEITAMENTO_ANTES)} aproveitada no manual e ${pct(APROVEITAMENTO_DEPOIS)} com o Organizar, a R$ ${CUSTO_METRO.toFixed(2).replace(".", ",")} o metro.`,
  },
]);
</script>
