import { ref } from "vue";
import { registrar } from "./metricas";

export const DOWNLOAD_URL =
  "https://github.com/pcauanobre/sublimaster-releases/releases/latest/download/SubliMaster-Setup.exe";

export const WHATSAPP = "5585998175354";
export const INSTAGRAM = "https://instagram.com/pcauanobre";
export const PORTFOLIO = "https://pedrocauanobre.is-a.dev";

export const zap = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

// versão mostrada no site: a escrita aqui até o GitHub responder
export const versao = ref("1.0.55");
let versaoPedida = false;
export async function carregarVersao() {
  if (versaoPedida) return;
  versaoPedida = true;
  try {
    const r = await fetch("https://api.github.com/repos/pcauanobre/sublimaster-releases/releases/latest");
    if (r.ok) {
      const j = await r.json();
      if (j.tag_name) versao.value = String(j.tag_name).replace(/^v/, "");
    }
  } catch (e) {
    /* fica a versão escrita */
  }
}

// todo botão de baixar leva primeiro ao formulário da chave de teste;
// depois de enviar, a pessoa cai na página do download
// (import tardio: o router importa as páginas, que importam este arquivo)
export async function baixar() {
  registrar("clique_baixar");
  const { router } = await import("./router");
  router.push({ name: "teste" });
}

export function iniciarDownload(comoFoi = "auto") {
  registrar("download", { det: comoFoi });
  const a = document.createElement("a");
  a.href = DOWNLOAD_URL;
  a.download = "SubliMaster-Setup.exe";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
