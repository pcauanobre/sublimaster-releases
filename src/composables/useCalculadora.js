import { ref, computed, watch, onBeforeUnmount } from "vue";

// Premissas da calculadora (mostradas na tela, embaixo de cada gráfico)
export const MIN_COM_SUBLIMASTER = 3; // colar a lista, conferir e exportar 20 peças
export const HORAS_POR_DIA = 8;
export const SEMANAS_POR_MES = 4.3;
export const APROVEITAMENTO_ANTES = 0.78; // folha montada no braço
export const APROVEITAMENTO_DEPOIS = 0.92; // folha montada pelo Organizar
export const CUSTO_METRO = 3.5; // papel + tinta, em reais

export function useCalculadora() {
  const minutosNoBraco = ref(30); // conjunto esportivo de 20 peças (máximo realista: 1h)
  const pedidosPorSemana = ref(10);
  const metrosPorSemana = ref(100);

  const minutosPoupados = computed(() => Math.max(0, minutosNoBraco.value - MIN_COM_SUBLIMASTER));
  const reducao = computed(() => Math.round((minutosPoupados.value / minutosNoBraco.value) * 100));

  // horas devolvidas, acumulando semana a semana
  const horasPorSemana = computed(() => (minutosPoupados.value * pedidosPorSemana.value) / 60);
  const horasNoMes = computed(() => horasPorSemana.value * SEMANAS_POR_MES);
  const diasNoMes = computed(() => horasNoMes.value / HORAS_POR_DIA);
  const semanas = computed(() => [1, 2, 3, 4].map((s) => horasPorSemana.value * s));

  // papel: mesma quantidade de peças em menos metros
  const metrosPoupadosSemana = computed(
    () => metrosPorSemana.value * (1 - APROVEITAMENTO_ANTES / APROVEITAMENTO_DEPOIS)
  );
  const reaisPorMes = computed(() => metrosPoupadosSemana.value * SEMANAS_POR_MES * CUSTO_METRO);

  // os dois lados da comparação, no mês
  const horasNoBracoMes = computed(() => (minutosNoBraco.value * pedidosPorSemana.value * SEMANAS_POR_MES) / 60);
  const horasComSubliMes = computed(() => (MIN_COM_SUBLIMASTER * pedidosPorSemana.value * SEMANAS_POR_MES) / 60);
  const metrosNoBracoMes = computed(() => metrosPorSemana.value * SEMANAS_POR_MES);
  const metrosComSubliMes = computed(() => metrosNoBracoMes.value * (APROVEITAMENTO_ANTES / APROVEITAMENTO_DEPOIS));

  return {
    horasNoBracoMes, horasComSubliMes, metrosNoBracoMes, metrosComSubliMes,
    minutosNoBraco, pedidosPorSemana, metrosPorSemana,
    minutosPoupados, reducao, horasPorSemana, horasNoMes, diasNoMes, semanas,
    metrosPoupadosSemana, reaisPorMes,
  };
}

// Número que corre até o valor novo em vez de pular (contador suave)
export function useNumeroSuave(fonte, duracao = 500) {
  const valor = ref(fonte.value);
  let quadro = 0;
  watch(fonte, (alvo) => {
    cancelAnimationFrame(quadro);
    const de = valor.value;
    const inicio = performance.now();
    const passo = (agora) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const e = 1 - Math.pow(1 - t, 3);
      valor.value = de + (alvo - de) * e;
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
  });
  onBeforeUnmount(() => cancelAnimationFrame(quadro));
  return valor;
}
