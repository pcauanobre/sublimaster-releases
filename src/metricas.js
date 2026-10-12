// Analytics próprio do site: cada evento vira um registro em site/acessos
// no Firebase (só escrita pública; leitura só pelo /admin). Sem cookie de
// terceiro: o visitante é um id aleatório guardado neste navegador.
// caminho sem a palavra "analytics": bloqueador de anúncio barra qualquer URL com ela
const URL_EVENTOS = "https://sublimaster-e3704-default-rtdb.firebaseio.com/site/acessos.json";

function idGuardado(armazem, chave) {
  try {
    let v = armazem.getItem(chave);
    if (!v) {
      v = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4);
      armazem.setItem(chave, v);
    }
    return v;
  } catch (e) {
    return "anon";
  }
}

export const visitante = () => idGuardado(localStorage, "subli-visitante");
const sessao = () => idGuardado(sessionStorage, "subli-sessao");

function dispositivo() {
  const w = window.innerWidth;
  return w < 768 ? "celular" : w < 1100 ? "tablet" : "computador";
}

// de onde veio: utm_source, senão o domínio do referrer, senão "direto"
function origem() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("utm_source")) return q.get("utm_source").slice(0, 40);
    if (document.referrer) {
      const h = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (h && h !== location.hostname) return h.slice(0, 40);
    }
  } catch (e) {
    /* segue */
  }
  return "direto";
}
const origemDaSessao = (() => {
  try {
    const salva = sessionStorage.getItem("subli-origem");
    if (salva) return salva;
    const o = origem();
    sessionStorage.setItem("subli-origem", o);
    return o;
  } catch (e) {
    return origem();
  }
})();

// não grava nada rodando no localhost nem dentro do /admin
const desligado = () => /^(localhost|127\.)/.test(location.hostname) || location.pathname.startsWith("/admin");

export function registrar(tipo, extra = {}) {
  if (desligado()) return;
  const corpo = {
    tipo,
    v: visitante(),
    s: sessao(),
    pagina: location.pathname.slice(0, 40),
    origem: origemDaSessao,
    idioma: (document.documentElement.lang || "en").slice(0, 5),
    disp: dispositivo(),
    quando: { ".sv": "timestamp" },
  };
  if (extra.det) corpo.det = String(extra.det).slice(0, 40);
  try {
    fetch(URL_EVENTOS, { method: "POST", body: JSON.stringify(corpo), keepalive: true }).catch(() => {});
  } catch (e) {
    /* analytics nunca derruba o site */
  }
}
