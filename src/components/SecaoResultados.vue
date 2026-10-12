<template>
  <!-- Calculadora: um slider no centro (pedidos por semana) move os três cartões.
       Cada cartão mostra quanto rende no "Manual" x "Com o SubliMaster" e o resultado. -->
  <section id="resultados" class="px-2 pt-2 md:px-3 md:pt-3">
    <div class="rounded-frame bg-white px-4 py-12 md:px-10 md:py-20">
      <div class="mx-auto max-w-[640px] text-center">
        <span v-aparecer class="font-mono text-[11px] uppercase tracking-wider text-muted">{{ t("calc.rotulo") }}</span>
        <h2 v-aparecer.foca="120" class="mt-3 font-display text-[34px] leading-[1.02] md:text-[48px]">
          {{ t("calc.titulo")[0] }} <span class="text-azul">{{ t("calc.titulo")[1] }}</span>
        </h2>
      </div>

      <!-- um slider só, no centro, que move os três cartões -->
      <div v-aparecer="250" class="mx-auto mt-10 max-w-[620px] text-center md:mt-12">
        <label for="faixa-pedidos" class="text-[15px] text-ink/60">{{ t("calc.pergunta") }}</label>
        <p class="mt-3 font-display text-[44px] leading-none md:text-[52px]">
          {{ pedidosPorSemana }} <span class="text-[18px] font-medium text-muted md:text-[20px]">{{ pedidosPorSemana === 1 ? t("calc.pedido") : t("calc.pedidos") }}</span>
        </p>
        <input
          id="faixa-pedidos"
          v-model.number="pedidosPorSemana"
          type="range"
          min="1"
          max="40"
          step="1"
          class="faixa faixa-central mt-5"
          :style="{ '--cheio': `${((pedidosPorSemana - 1) / 39) * 100}%` }"
        />
        <div class="mt-2 flex justify-between font-mono text-[11px] text-muted"><span>1</span><span>40</span></div>
      </div>

      <div class="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
        <article
          v-for="(c, i) in cartoes"
          :key="c.id"
          v-aparecer="i * 120"
          class="grafico flex flex-col rounded-[22px] border border-line bg-white p-6 transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(11,18,34,.35)] md:p-7"
        >

          <!-- comparação: mede o quanto rende, então quem rende mais tem a barra maior -->
          <div class="space-y-4">
            <LinhaComparacao lado="manual" :valor="c.manual" :largura="c.larguraManual" />
            <LinhaComparacao lado="subli" :valor="c.subli" :largura="c.larguraSubli" />
          </div>

          <div class="mt-7 border-t border-line pt-5">
            <p class="font-display text-[40px] leading-none text-azul">{{ c.resultado }}</p>
            <p class="mt-2 text-[14px] text-ink/70">{{ c.legenda }}</p>
          </div>
        </article>
      </div>

      <p v-aparecer="300" class="mx-auto mt-8 max-w-[760px] text-center text-[11px] leading-relaxed text-muted">
        {{ t("calc.nota")(minutosNoBraco, MIN_COM_SUBLIMASTER, METROS_POR_PEDIDO) }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, watch, watchEffect } from "vue";
import { registrar } from "../metricas";
import { Clock, CalendarDays, Scroll } from "lucide-vue-next";
import LinhaComparacao from "./LinhaComparacao.vue";
import { t } from "../i18n";
import {
  useCalculadora, useNumeroSuave,
  MIN_COM_SUBLIMASTER, APROVEITAMENTO_ANTES, APROVEITAMENTO_DEPOIS,
} from "../composables/useCalculadora";

// um pedido de 20 peças (camisa + short) gasta uns 10 m de papel
const METROS_POR_PEDIDO = 10;

const { minutosNoBraco, pedidosPorSemana, metrosPorSemana, horasNoMes, reaisPorMes } = useCalculadora();

// o slider central move tudo: papel acompanha o número de pedidos
let usouCalc = false;
watch(pedidosPorSemana, () => { if (!usouCalc) { usouCalc = true; registrar("calculadora"); } });
watchEffect(() => { metrosPorSemana.value = pedidosPorSemana.value * METROS_POR_PEDIDO; });

const poupadoSemana = computed(() => (pedidosPorSemana.value * (minutosNoBraco.value - MIN_COM_SUBLIMASTER)) / 60);

// números do resultado correm até o valor novo
const semanaSuave = useNumeroSuave(poupadoSemana);
const horasSuave = useNumeroSuave(horasNoMes);
const reaisSuave = useNumeroSuave(reaisPorMes);

const formatarNum = (v) => Math.round(v).toLocaleString("pt-BR");
const formatarDec = (v) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
// escalas fixas no máximo do slider (40 pedidos): as barras andam quando ele anda
const MAX_PEDIDOS = 40;
const p = () => pedidosPorSemana.value;
const horasManual = computed(() => (p() * minutosNoBraco.value) / 60);
const horasSubli = computed(() => (p() * MIN_COM_SUBLIMASTER) / 60);
const escalaHoras = (MAX_PEDIDOS * minutosNoBraco.value) / 60;
const escalaPedidos = (MAX_PEDIDOS * minutosNoBraco.value) / MIN_COM_SUBLIMASTER;
const escalaMetros = MAX_PEDIDOS * METROS_POR_PEDIDO;

const cartoes = computed(() => [
  {
    id: "tempo",
    icone: Clock,
    rotulo: "Horas no arquivo por semana",
    manual: `${formatarDec(Math.round(horasManual.value * 10) / 10)}${t("calc.horasArquivo")}`,
    subli: `${formatarDec(Math.round(horasSubli.value * 10) / 10)}${t("calc.horasArquivo")}`,
    larguraManual: (horasManual.value / escalaHoras) * 100,
    larguraSubli: (horasSubli.value / escalaHoras) * 100,
    resultado: `${formatarDec(Math.round(semanaSuave.value * 10) / 10)}h`,
    legenda: t("calc.menosSemana"),
  },
  {
    id: "pedidos",
    icone: CalendarDays,
    rotulo: "Pedidos no mesmo tempo",
    manual: `${p()} ${t("calc.porSemana")}`,
    subli: `${formatarNum((p() * minutosNoBraco.value) / MIN_COM_SUBLIMASTER)} ${t("calc.porSemana")}`,
    larguraManual: (p() / escalaPedidos) * 100,
    larguraSubli: (((p() * minutosNoBraco.value) / MIN_COM_SUBLIMASTER) / escalaPedidos) * 100,
    resultado: `${formatarNum(horasSuave.value)}h`,
    legenda: t("calc.livresMes"),
  },
  {
    id: "papel",
    icone: Scroll,
    rotulo: "Papel aproveitado por semana",
    manual: `${formatarNum(metrosPorSemana.value * APROVEITAMENTO_ANTES)} ${t("calc.papel")}`,
    subli: `${formatarNum(metrosPorSemana.value * APROVEITAMENTO_DEPOIS)} ${t("calc.papel")}`,
    larguraManual: ((metrosPorSemana.value * APROVEITAMENTO_ANTES) / escalaMetros) * 100,
    larguraSubli: ((metrosPorSemana.value * APROVEITAMENTO_DEPOIS) / escalaMetros) * 100,
    resultado: `R$ ${formatarNum(reaisSuave.value)}`,
    legenda: t("calc.menosPapel"),
  },
]);</script>