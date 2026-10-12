<template>
  <!-- Notebook com a gravação real do script (com player) e a janela do SubliMaster
       ao lado. Tudo desenhado em código num palco de tamanho
       fixo, que é reduzido por inteiro para caber na largura disponível. -->
  <div ref="moldura" class="relative w-full" :style="{ height: `${ALTURA * escala}px` }">
    <div
      ref="palco"
      data-palco
      class="absolute left-1/2 top-0 origin-top"
      :style="{ width: `${LARGURA}px`, height: `${ALTURA}px`, transform: `translateX(-50%) scale(${escala})` }"
    >
      <!-- notebook (genérico, Windows) com a gravação real do Corel em loop -->
      <div class="absolute left-[10px] top-[40px] w-[720px] animate-sobe [perspective:1800px]">
        <div>
        <div class="rounded-t-[18px] border border-white/10 bg-[#0b0d12] p-[8px] pb-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
          <span class="mx-auto mb-[4px] block h-[4px] w-[4px] rounded-full bg-white/15"></span>
          <!-- tela na proporção do que foi gravado (1280x692, sem a barra de tarefas): sem faixa preta embaixo -->
          <div class="group relative aspect-[1280/692] overflow-hidden rounded-[4px] bg-black">
            <Transition name="video" mode="out-in">
              <video
                ref="tela"
                :key="video"
                class="h-full w-full cursor-pointer object-cover object-top"
                :class="{ 'video-volta': voltando }"
                :src="video"
                autoplay
                muted
                playsinline
                preload="auto"
                :aria-label="`Gravação do SubliMaster: ${ativo} no CorelDRAW`"
                @timeupdate="aoTempo"
                @loadedmetadata="aoCarregar"
                @play="tocando = true"
                @pause="aoPausar"
                @ended="aoTerminar"
                @click="alternar"
              ></video>
            </Transition>

            <!-- player: aparece com o mouse em cima ou com o vídeo parado -->
            <div
              class="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 transition-opacity duration-300"
              :class="clicando ? 'pointer-events-none opacity-0' : tocando ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-100'"
            >
              <button
                class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/90 text-ink transition hover:bg-white"
                :aria-label="tocando ? 'Pausar' : 'Continuar'"
                @click="alternar"
              >
                <svg v-if="tocando" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
                <svg v-else viewBox="0 0 24 24" class="ml-0.5 h-3.5 w-3.5" fill="currentColor"><path d="m7 4 13 8-13 8V4z" /></svg>
              </button>
              <div
                ref="trilho"
                class="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/25"
                role="slider"
                aria-label="Posição do vídeo"
                :aria-valuenow="Math.round(progresso * 100)"
                @pointerdown="buscar"
              >
                <div class="absolute inset-y-0 left-0 rounded-full bg-azul" :style="{ width: `${progresso * 100}%` }"></div>
              </div>
              <span class="w-[74px] shrink-0 text-right font-mono text-[11px] text-white/80">{{ relogio(tempo) }} / {{ relogio(duracao) }}</span>
              <!-- tela cheia (no celular o notebook fica pequeno) -->
              <button
                class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
                aria-label="Tela cheia"
                @click="telaCheia"
              >
                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></svg>
              </button>
            </div>
          </div>
        </div>        <!-- base: teclado visto de frente, sem a cara de MacBook -->
        <div class="relative mx-[-40px] h-[20px] rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#454b58] via-[#2a2e37] to-[#15171d] shadow-[0_30px_50px_-20px_rgba(0,0,0,.8)]">
          <span class="absolute inset-x-[40px] top-0 h-px bg-white/20"></span>
          <span class="absolute left-1/2 top-[3px] h-[5px] w-[110px] -translate-x-1/2 rounded-full bg-black/40"></span>
        </div>
        </div>
      </div>
      <!-- app no tamanho real (347x831) reduzido, com halo azul em volta -->
      <!-- entra da direita quando o quadro aparece e sai pra direita quando ele some (mesmo efeito, ao contrário) -->
      <div
        class="absolute right-[18px] top-[10px] z-20 h-[482px] w-[201px] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] [perspective:1600px]"
        :class="janelaNaTela ? 'translate-x-0 opacity-100' : 'translate-x-[220px] opacity-0'"
        :style="{ transitionDelay: janelaNaTela ? '250ms' : '0ms' }"
      >
        <div class="janela-lisa relative" :style="estiloJanela">
          <!-- brilho por baixo do menu: halo azul que respira junto com o contorno da janela -->
          <div class="halo-menu pointer-events-none absolute inset-0 rounded-[10px]"></div>
          <div class="relative rounded-[10px] shadow-[0_40px_70px_-20px_rgba(0,0,0,.85)] ">
            <JanelaApp :alvo="alvoClique" @clique="aoApertar" @clicou="aoClicou" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { marcas, demo } from "../marcas";
import JanelaApp from "./JanelaApp.vue";

const props = defineProps({
  ativo: { type: String, default: "Repassar" },
  // gravação do script da aba ativa; troca junto com a aba
  video: { type: String, default: "/demo-repassar.mp4" },
});
const emit = defineEmits(["progresso", "fim"]);

const tela = ref(null);
const trilho = ref(null);
const tocando = ref(false);
const tempo = ref(0);
const duracao = ref(0);
const progresso = ref(0);
// pausa feita para o clique no menu (escondida do usuário: o player some)
const clicando = ref(false);
let jaClicou = false;

const palco = ref(null);

function aoCarregar() {
  duracao.value = tela.value ? tela.value.duration : 0;
  demo.duracao = duracao.value;
}

function aoTempo() {
  const v = tela.value;
  if (!v) return;
  tempo.value = v.currentTime;
  progresso.value = v.duration ? v.currentTime / v.duration : 0;
  demo.tempo = v.currentTime;
  emit("progresso", progresso.value);
}

// o timeupdate do vídeo só chega ~4x por segundo: a marca é vigiada a cada
// quadro de tela, para pausar e mostrar o cursor no instante certo
let vigia = 0;
function vigiarMarca() {
  cancelAnimationFrame(vigia);
  const passo = () => {
    const v = tela.value;
    // progresso a cada quadro: a barra da aba enche lisa (o timeupdate só vem ~4x/s)
    if (v && v.duration) emit("progresso", v.currentTime / v.duration);
    const m = marcas[props.ativo];
    if (v && !v.paused && typeof m === "number" && !jaClicou && v.currentTime >= m) {
      jaClicou = true;
      clicarNoMenu();
    }
    vigia = requestAnimationFrame(passo);
  };
  vigia = requestAnimationFrame(passo);
}

const aoTerminar = () => emit("fim");

// pausa do clique é interna: o player continua como se o vídeo estivesse tocando
function aoPausar() {
  if (!clicando.value) tocando.value = false;
}

// pausa (escondida), o cursor clica no script dentro do menu e o vídeo continua
const alvoClique = ref(null);
function clicarNoMenu() {
  clicando.value = true;            // antes do pause: o player não vê a pausa
  tela.value && tela.value.pause();
  alvoClique.value = props.ativo;
}
// volta do vídeo depois do clique: desfoca, clareia de leve e foca de novo
const voltando = ref(false);
let fimVolta = 0;
// no instante do clique no menu: o vídeo desfoca e volta a tocar já focando
function aoApertar() {
  voltando.value = false;
  clearTimeout(fimVolta);
  requestAnimationFrame(() => { voltando.value = true; });
  fimVolta = setTimeout(() => { voltando.value = false; }, 1300);
  clicando.value = false;
  tela.value && tela.value.play().catch(() => {});
}
function aoClicou() {
  alvoClique.value = null;
  tela.value && tela.value.play().catch(() => {});
}
// abre o vídeo em tela cheia (iPhone usa o modo próprio do player)
function telaCheia() {
  const v = tela.value;
  if (!v) return;
  if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
  else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
  else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
}

function alternar() {
  const v = tela.value;
  if (!v || clicando.value) return;
  if (v.paused) v.play().catch(() => {});
  else v.pause();
}

// clicar ou arrastar no trilho leva o vídeo para aquele ponto
function buscar(e) {
  const v = tela.value;
  const el = trilho.value;
  if (!v || !el || !v.duration) return;
  const ir = (ev) => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
    v.currentTime = p * v.duration;
    // voltou para antes da marca: o clique pode acontecer de novo
    const m = marcas[props.ativo];
    if (typeof m === "number" && v.currentTime < m) jaClicou = false;
  };
  ir(e);
  const soltar = () => { window.removeEventListener("pointermove", ir); window.removeEventListener("pointerup", soltar); };
  window.addEventListener("pointermove", ir);
  window.addEventListener("pointerup", soltar);
}

const relogio = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// vídeo novo (troca de aba): zera tudo
watch(() => props.video, () => {
  jaClicou = false;
  alvoClique.value = null;
  clicando.value = false;
  tempo.value = 0;
  progresso.value = 0;
});
watch(() => props.ativo, (a) => { demo.ativo = a; }, { immediate: true });

demo.video = () => tela.value;

// ajuste da janela do app. Escala base .58 = 347x831 -> 201x482.
// A inclinação gira em volta do centro; translateZ(0) + backface + contorno
// transparente deixam a borda lisa (sem serrilhado) quando entorta.
const estiloJanela = computed(() => {
  const j = marcas.janela || {};
  const e = 0.58 * (j.escala || 1);
  return {
    width: "347px",
    height: "831px",
    transformOrigin: "0 0",
    transform:
      `translate(${j.x || 0}px, ${j.y || 0}px) scale(${e}) ` +
      `translate(173.5px, 415.5px) rotateY(${j.girarY || 0}deg) rotateX(${j.girarX || 0}deg) rotateZ(${j.girarZ || 0}deg) translate(-173.5px, -415.5px) translateZ(0)`,
  };
});

// palco desenhado nesse tamanho e reduzido por inteiro
const LARGURA = 960;
const ALTURA = 500;

const moldura = ref(null);
const escala = ref(1);
let obs = null;
const medir = () => {
  if (!moldura.value) return;
  // cabe na largura e na altura do quadro (descontando o respiro de cima e de baixo)
  const pai = moldura.value.parentElement;
  const alturaLivre = pai ? pai.clientHeight - 48 : Infinity;
  escala.value = Math.min(1, moldura.value.clientWidth / LARGURA, alturaLivre / ALTURA);
};
// janela do app aparece/some junto com o quadro do mockup na tela
const janelaNaTela = ref(false);
let obsTela = null;

onMounted(() => {
  vigiarMarca();
  // aparece com qualquer pedaço do mockup na tela (em tela pequena ele nunca fica 35% visível)
  obsTela = new IntersectionObserver(([e]) => { janelaNaTela.value = e.isIntersecting && e.intersectionRatio > 0.08; }, { threshold: [0, 0.08, 0.2] });
  obsTela.observe(moldura.value);
  medir();
  obs = new ResizeObserver(medir);
  obs.observe(moldura.value);
  if (moldura.value.parentElement) obs.observe(moldura.value.parentElement);
});
onBeforeUnmount(() => { obs && obs.disconnect(); obsTela && obsTela.disconnect(); cancelAnimationFrame(vigia); });

</script>
