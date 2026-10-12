import { reactive } from "vue";

// Momento (em segundos) de cada gravação em que o vídeo pausa e o cursor clica
// no script certo do menu do SubliMaster, ao lado do notebook. Depois do clique
// o vídeo continua.
export const MARCAS_PADRAO = {
  Repassar: 4.4,
  Uniforme: 4.4,
  Exportar: 7.4,
  Organizar: 5.7,
  // de onde o cursor sai, em % do MENU do app (largura e altura); como o menu
  // cresce, encolhe e entorta junto com a tela, o ponto fica sempre no mesmo lugar dele
  origem: { x: 8.2, y: 48.5 },
  // janela do app ao lado do notebook: tamanho, posição (px do palco) e inclinação (graus)
  janela: { escala: 1.61, x: -123, y: -198, girarY: 0, girarX: 0, girarZ: 0 },
};
export const marcas = reactive({ ...MARCAS_PADRAO });

// estado do vídeo que está no notebook agora (o editor lê daqui)
export const demo = reactive({ ativo: "Repassar", tempo: 0, duracao: 0 });

