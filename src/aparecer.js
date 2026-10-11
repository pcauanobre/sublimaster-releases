// v-aparecer: o elemento entra quando chega na tela e sai do mesmo jeito,
// ao contrário e na mesma velocidade, quando deixa a tela.
//   v-aparecer            sobe e aparece
//   v-aparecer.foca       sobe, aparece e sai do desfoque (títulos)
//   v-aparecer="120"      mesmo efeito, com 120 ms de atraso (cascata)
export const aparecer = {
  mounted(el, binding) {
    el.classList.add("revela");
    if (binding.modifiers.foca) el.classList.add("revela-foca");
    if (binding.value) el.style.setProperty("--atraso", `${binding.value}ms`);

    const obs = new IntersectionObserver(
      ([e]) => el.classList.toggle("visivel", e.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    obs.observe(el);
    el._obsAparecer = obs;
  },
  unmounted(el) {
    el._obsAparecer && el._obsAparecer.disconnect();
  },
};
