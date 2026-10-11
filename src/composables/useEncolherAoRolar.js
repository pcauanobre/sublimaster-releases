import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// O topo ocupa a tela inteira e, ao rolar, recolhe a altura até virar uma
// faixa baixa (alturaFinal). A base dele acompanha a rolagem, então o que vem
// embaixo sobe colado, sem vão.
//   altura     segue a rolagem exata (se atrasar, abre vão com a seção de baixo)
//   progresso  de 0 (aberto) a 1 (faixa), com inércia: é o que move o conteúdo
export function useEncolherAoRolar(alturaFinal) {
  const rolado = ref(0);
  const tela = ref(typeof window === "undefined" ? 900 : window.innerHeight);
  const progresso = ref(0);
  let quadro = 0;

  const final = computed(() => alturaFinal(tela.value));
  const percurso = computed(() => Math.max(1, tela.value - final.value));
  const altura = computed(() => Math.max(final.value, tela.value - rolado.value));
  const alvo = () => Math.min(1, rolado.value / percurso.value);

  // a cada quadro anda 18% do que falta: chega macio e para sozinho
  const passo = () => {
    rolado.value = window.scrollY;
    const falta = alvo() - progresso.value;
    if (Math.abs(falta) < 0.0005) {
      progresso.value = alvo();
      quadro = 0;
      return;
    }
    progresso.value += falta * 0.18;
    quadro = requestAnimationFrame(passo);
  };
  // a altura é lida já no evento, sem esperar o próximo quadro
  const acordar = () => {
    rolado.value = window.scrollY;
    if (!quadro) quadro = requestAnimationFrame(passo);
  };
  const aoRedimensionar = () => { tela.value = window.innerHeight; acordar(); };

  onMounted(() => {
    rolado.value = window.scrollY;
    progresso.value = alvo();
    window.addEventListener("scroll", acordar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", acordar);
    window.removeEventListener("resize", aoRedimensionar);
    cancelAnimationFrame(quadro);
  });

  return { tela, altura, progresso };
}
