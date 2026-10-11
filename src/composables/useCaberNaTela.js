import { ref, onMounted, onBeforeUnmount } from "vue";

// Diminui o conteúdo na mesma proporção até caber no espaço que sobra na
// tela, sem rolagem. No celular (abaixo de 768px) não mexe: lá rola normal.
export function useCaberNaTela(conteudo, espaco) {
  const escala = ref(1);
  const alturaFinal = ref(null);
  let observador = null;

  const medir = () => {
    const el = conteudo.value;
    const area = espaco.value;
    if (!el || !area) return;
    if (window.innerWidth < 768) {
      escala.value = 1;
      alturaFinal.value = null;
      return;
    }
    // tamanho natural, sem a escala aplicada
    const altura = el.scrollHeight;
    const largura = el.scrollWidth;
    // 0.88: sobra um respiro em volta em vez de encostar nas bordas
    const e = Math.min(0.88, (area.clientHeight / altura) * 0.92, area.clientWidth / largura);
    escala.value = e;
    alturaFinal.value = altura * e;
  };

  onMounted(() => {
    medir();
    observador = new ResizeObserver(medir);
    observador.observe(conteudo.value);
    observador.observe(espaco.value);
    window.addEventListener("resize", medir);
  });
  onBeforeUnmount(() => {
    observador && observador.disconnect();
    window.removeEventListener("resize", medir);
  });

  return { escala, alturaFinal };
}
