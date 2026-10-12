<template>
  <main class="min-h-screen bg-[#EDEDEA] p-2 md:p-3">
    <!-- Painel do Pedro: visitas, funil e leads do site. Login com a conta de admin do Firebase. -->

    <!-- ===== login ===== -->
    <div v-if="!token" class="relative flex min-h-[calc(100svh-16px)] flex-col overflow-hidden rounded-frame text-white md:min-h-[calc(100vh-24px)]">
      <FundoPixel />
      <div class="relative z-10 flex flex-1 items-center justify-center px-5">
        <div class="w-full max-w-[400px]">
          <RouterLink to="/" class="flex items-center justify-center gap-2 text-[15px] font-semibold">
            <img src="/logo.png" alt="" class="h-8 w-8" />SubliMaster
          </RouterLink>
          <h1 class="mt-6 text-center font-display text-[36px] leading-none">Painel</h1>
          <form class="mt-8 space-y-3 rounded-[22px] border border-white/10 bg-white/[.05] p-5 backdrop-blur" @submit.prevent="entrar(email, senha)">
            <label class="block">
              <span class="text-[12px] text-white/60">E-mail</span>
              <input v-model.trim="email" type="email" autocomplete="username" class="campo mt-1" />
            </label>
            <label class="block">
              <span class="text-[12px] text-white/60">Senha</span>
              <input v-model="senha" type="password" autocomplete="current-password" class="campo mt-1" />
            </label>
            <p v-if="erroLogin" class="text-[13px] text-[#fca5a5]">{{ erroLogin }}</p>
            <button type="submit" class="w-full rounded-xl bg-azul py-3 text-[15px] font-semibold transition hover:bg-[#2563EB] disabled:opacity-60" :disabled="entrando">
              {{ entrando ? "Entrando..." : "Entrar" }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- ===== painel ===== -->
    <div v-else class="space-y-2 md:space-y-3">
      <!-- topo escuro -->
      <header class="relative overflow-hidden rounded-frame px-5 py-6 text-white md:px-8 md:py-8">
        <FundoPixel glow="centro" />
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <RouterLink to="/" aria-label="Ir para o site"><img src="/logo.png" alt="" class="h-9 w-9 transition hover:scale-105" /></RouterLink>
            <div>
              <h1 class="font-display text-[26px] leading-none md:text-[30px]">Painel</h1>
              <p class="mt-1 text-[13px] text-white/55">
                Últimos {{ dias }} dias
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <!-- período -->
            <div class="inline-grid grid-cols-3 rounded-full border border-white/10 bg-white/5 p-1 text-[12px]" role="tablist">
              <button
                v-for="p in [7, 30, 90]"
                :key="p"
                role="tab"
                :aria-selected="dias === p"
                class="rounded-full px-3 py-1 font-medium transition-colors"
                :class="dias === p ? 'bg-white text-ink' : 'text-white/60 hover:text-white'"
                @click="dias = p"
              >{{ p }} dias</button>
            </div>
            <button class="rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-medium transition hover:bg-white/10 disabled:opacity-50" :disabled="carregando" @click="carregar">{{ carregando ? "Atualizando..." : "Atualizar" }}</button>
            <button class="rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-medium transition hover:bg-white/10" @click="sair">Sair</button>
          </div>
        </div>
      </header>

      <!-- números principais -->
      <section class="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-3">
        <div v-for="k in kpis" :key="k.rotulo" class="rounded-frame bg-white p-5 md:p-6">
          <p class="text-[12px] text-muted">{{ k.rotulo }}</p>
          <p class="mt-2 font-display text-[34px] leading-none">{{ k.valor }}</p>
          <p class="mt-2 text-[12px]" :class="k.variacao == null ? 'text-muted' : k.variacao >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'">
            <template v-if="k.variacao != null">{{ k.variacao >= 0 ? "▲" : "▼" }} {{ Math.abs(k.variacao) }}% vs período anterior</template>
            <template v-else>{{ k.nota }}</template>
          </p>
        </div>
      </section>

      <!-- visitantes por dia + funil -->
      <section class="grid gap-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-3">
        <div class="rounded-frame bg-white p-5 md:p-7">
          <div class="flex items-baseline justify-between">
            <h2 class="text-[15px] font-semibold">Visitantes por dia</h2>
            <span class="text-[12px] text-muted">pico {{ picoDia }}</span>
          </div>
          <div class="relative mt-5 h-[220px]" @mouseleave="dica = null">
            <!-- linhas de grade -->
            <div v-for="g in grade" :key="g.valor" class="absolute inset-x-0 border-t border-dashed border-line" :style="{ bottom: `${g.pos * 100}%` }">
              <span class="absolute -top-2.5 left-0 bg-white pr-1 font-mono text-[10px] text-muted">{{ g.valor }}</span>
            </div>
            <p v-if="!porDia.some((d) => d.visitantes)" class="absolute inset-0 grid place-items-center text-[13px] text-muted">Nenhuma visita no período ainda.</p>
            <div class="absolute inset-0 left-7 flex items-end gap-[2px]">
              <div
                v-for="d in porDia"
                :key="d.dia"
                class="group relative flex h-full flex-1 items-end"
                @mouseenter="dica = d"
              >
                <span
                  class="w-full rounded-t-[4px] bg-azul transition-[height,opacity] duration-300"
                  :class="dica && dica.dia !== d.dia ? 'opacity-50' : ''"
                  :style="{ height: `${picoDia ? (d.visitantes / picoDia) * 100 : 0}%`, minHeight: d.visitantes ? '2px' : '0' }"
                ></span>
              </div>
            </div>
            <!-- dica ao passar o mouse -->
            <div
              v-if="dica"
              class="pointer-events-none absolute top-1 z-10 whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-[12px] text-white shadow-lg"
              :style="posDica"
            >
              <b class="font-semibold">{{ dica.rotulo }}</b> · {{ dica.visitantes }} visitantes · {{ dica.leads }} leads
            </div>
          </div>
          <div class="mt-2 flex justify-between pl-7 font-mono text-[10px] text-muted">
            <span>{{ porDia[0] && porDia[0].rotulo }}</span><span>{{ porDia.length && porDia[porDia.length - 1].rotulo }}</span>
          </div>
        </div>

        <div class="rounded-frame bg-white p-5 md:p-7">
          <h2 class="text-[15px] font-semibold">Funil</h2>
          <p class="text-[12px] text-muted">visitantes únicos em cada etapa</p>
          <ol class="mt-5 space-y-4">
            <li v-for="(f, i) in funil" :key="f.rotulo">
              <div class="flex items-baseline justify-between text-[13px]">
                <span>{{ f.rotulo }}</span>
                <span class="font-mono"><b class="font-semibold">{{ f.total }}</b>
                  <span v-if="i > 0 && f.taxa != null" class="text-muted"> · {{ f.taxa }}%</span></span>
              </div>
              <div class="mt-1.5 h-2.5 rounded-full bg-[#EEF2F8]">
                <div class="h-full rounded-full bg-azul transition-[width] duration-500" :style="{ width: `${funil[0].total ? Math.max(1.5, (f.total / funil[0].total) * 100) : 0}%` }"></div>
              </div>
            </li>
          </ol>
          <p class="mt-6 rounded-xl bg-panel px-3 py-2.5 text-[12px] text-ink/70">
            <b class="font-semibold text-ink">{{ conversao }}%</b> dos visitantes viram lead.
          </p>
        </div>
      </section>

      <!-- de onde vem, aparelho, idioma, abas -->
      <section class="grid gap-2 md:grid-cols-4 md:gap-3">
        <div v-for="q in quebras" :key="q.titulo" class="rounded-frame bg-white p-5 md:p-6">
          <h2 class="text-[15px] font-semibold">{{ q.titulo }}</h2>
          <ul class="mt-4 space-y-3">
            <li v-for="item in q.itens" :key="item.nome">
              <div class="flex justify-between text-[13px]">
                <span class="truncate pr-2">{{ item.nome }}</span>
                <span class="font-mono text-muted">{{ item.total }} · {{ item.pct }}%</span>
              </div>
              <div class="mt-1 h-1.5 rounded-full bg-[#EEF2F8]">
                <div class="h-full rounded-full bg-azul" :style="{ width: `${item.pct}%` }"></div>
              </div>
            </li>
            <li v-if="!q.itens.length" class="text-[13px] text-muted">Sem dados no período.</li>
          </ul>
        </div>
      </section>

      <!-- leads -->
      <section class="rounded-frame bg-white p-5 md:p-7">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-[15px] font-semibold">Leads</h2>
            <p class="text-[12px] text-muted">{{ leadsFiltrados.length }} no período</p>
          </div>
          <div class="flex w-full gap-2 sm:w-auto">
            <input v-model.trim="busca" placeholder="Buscar nome, e-mail ou número" class="w-full rounded-xl border border-line bg-panel px-3 py-2 text-[13px] outline-none focus:border-azul sm:w-[260px]" />
            <button class="shrink-0 rounded-xl border border-line px-3 py-2 text-[13px] font-medium transition hover:bg-panel" @click="exportar">Exportar CSV</button>
          </div>
        </div>

        <div class="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-3">
          <article v-for="l in leadsFiltrados.slice(0, mostrar)" :key="l.id" class="flex flex-col rounded-card border border-line p-4">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-azul/10 text-[13px] font-semibold text-azul">{{ iniciais(l.nome) }}</span>
              <div class="min-w-0">
                <p class="truncate text-[14px] font-semibold">{{ l.nome }}</p>
                <p class="text-[12px] text-muted">{{ quando(l.quando) }}</p>
              </div>
            </div>
            <dl class="mt-4 space-y-1.5 text-[13px]">
              <div class="flex gap-2"><dt class="w-[62px] shrink-0 text-muted">WhatsApp</dt><dd class="truncate font-mono">{{ telefone(l.contato) }}</dd></div>
              <div v-if="l.email" class="flex gap-2"><dt class="w-[62px] shrink-0 text-muted">E-mail</dt><dd class="truncate">{{ l.email }}</dd></div>
              <div v-else-if="l.msg" class="flex gap-2"><dt class="w-[62px] shrink-0 text-muted">Recado</dt><dd class="truncate">{{ l.msg }}</dd></div>
            </dl>
            <div class="mt-4 grid grid-cols-2 gap-2 pt-1">
              <a :href="linkZap(l)" target="_blank" rel="noopener" class="grid place-items-center rounded-lg bg-[#25D366] py-2 text-[12px] font-semibold text-white transition hover:brightness-95">WhatsApp</a>
              <a :href="l.email ? `mailto:${l.email}` : undefined" class="grid place-items-center rounded-lg border border-line py-2 text-[12px] font-semibold transition" :class="l.email ? 'hover:bg-panel' : 'pointer-events-none opacity-40'">E-mail</a>
            </div>
          </article>
          <p v-if="!leadsFiltrados.length" class="col-span-full py-8 text-center text-[13px] text-muted">Nenhum lead no período.</p>
        </div>
        <button
          v-if="leadsFiltrados.length > mostrar"
          class="mx-auto mt-5 block rounded-xl border border-line px-5 py-2.5 text-[13px] font-medium transition hover:bg-panel"
          @click="mostrar += 24"
        >Ver mais ({{ leadsFiltrados.length - mostrar }})</button>
      </section>
    </div>
    <!-- toast de falha: canto de baixo, some sozinho ou no X -->
    <Transition name="toast">
      <div
        v-if="erroDados"
        role="alert"
        class="fixed bottom-5 right-5 z-[80] flex max-w-[360px] items-start gap-3 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-[13px] text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,.5)]"
      >
        <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ef4444]"></span>
        <span class="flex-1">{{ erroDados }}</span>
        <button class="font-semibold text-azul-claro hover:text-white" @click="carregar">Tentar de novo</button>
        <button class="text-white/50 hover:text-white" aria-label="Fechar" @click="erroDados = ''">✕</button>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import FundoPixel from "../components/FundoPixel.vue";
import { useAdmin } from "../composables/useAdmin";

const { token, entrando, erroLogin, carregando, erroDados, dias, leads, eventos, fonteLeads, fonteEventos, entrar, retomar, sair, carregar } = useAdmin();

const email = ref("");
const senha = ref("");
const busca = ref("");
const dica = ref(null);
const mostrar = ref(24);   // cartões de lead visíveis; "Ver mais" abre mais 24
const DIA = 86400000;

onMounted(async () => { if (await retomar()) carregar(); });



// ---------- contas ----------
const unicos = (lista) => new Set(lista.map((e) => e.v)).size;
const doTipo = (tipo, lista = eventos.value) => lista.filter((e) => e.tipo === tipo);

const visitantes = computed(() => unicos(doTipo("visita")));
const sessoes = computed(() => new Set(doTipo("visita").map((e) => e.s)).size);
const conversao = computed(() => (visitantes.value ? ((leads.value.length / visitantes.value) * 100).toFixed(1).replace(".", ",") : "0"));

// período anterior, do mesmo tamanho, para a variação
function noAnterior(lista) {
  const fim = Date.now() - dias.value * DIA;
  const ini = fim - dias.value * DIA;
  return lista.filter((x) => x.quando >= ini && x.quando < fim);
}
const variacao = (agora, antes) => (antes ? Math.round(((agora - antes) / antes) * 100) : null);

const kpis = computed(() => {
  const evAntes = noAnterior(fonteEventos.value);
  const visAntes = unicos(evAntes.filter((e) => e.tipo === "visita"));
  const leadsAntes = noAnterior(fonteLeads.value).length;
  const baixarAntes = unicos(evAntes.filter((e) => e.tipo === "download"));
  const downloads = unicos(doTipo("download"));
  return [
    { rotulo: "Visitantes únicos", valor: visitantes.value, variacao: variacao(visitantes.value, visAntes) },
    { rotulo: "Visitas", valor: sessoes.value, nota: "sessões no site" },
    { rotulo: "Leads", valor: leads.value.length, variacao: variacao(leads.value.length, leadsAntes) },
    { rotulo: "Downloads", valor: downloads, variacao: variacao(downloads, baixarAntes) },
    { rotulo: "Conversão", valor: `${conversao.value}%`, nota: "visitante → lead" },
  ];
});
// visitantes e leads por dia
const porDia = computed(() => {
  const n = dias.value;
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const caixas = Array.from({ length: n }, (_, i) => {
    const ini = hoje.getTime() - (n - 1 - i) * DIA;
    const dt = new Date(ini);
    return { dia: ini, rotulo: `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}`, vs: new Set(), leads: 0 };
  });
  const achar = (t) => {
    const i = Math.floor((t - caixas[0].dia) / DIA);
    return caixas[i];
  };
  doTipo("visita").forEach((e) => { const c = achar(e.quando); if (c) c.vs.add(e.v); });
  leads.value.forEach((l) => { const c = achar(l.quando); if (c) c.leads++; });
  return caixas.map((c) => ({ dia: c.dia, rotulo: c.rotulo, visitantes: c.vs.size, leads: c.leads }));
});
const picoDia = computed(() => Math.max(1, ...porDia.value.map((d) => d.visitantes)));
// linhas da grade: 0, metade e pico, sem repetir número
const grade = computed(() => {
  const p = picoDia.value;
  const lista = [{ valor: 0, pos: 0 }, { valor: p, pos: 1 }];
  if (p >= 4) lista.push({ valor: Math.round(p / 2), pos: Math.round(p / 2) / p });
  return lista;
});
// dica: acompanha a barra, mas encosta nas bordas em vez de sair do quadro
const posDica = computed(() => {
  const i = porDia.value.indexOf(dica.value);
  const f = (i + 0.5) / porDia.value.length;
  return { left: `calc(28px + (100% - 28px) * ${f})`, transform: `translateX(-${Math.round(f * 100)}%)` };
});

const funil = computed(() => {
  const etapas = [
    { rotulo: "Visitaram o site", total: visitantes.value },
    { rotulo: "Clicaram em baixar", total: unicos(doTipo("clique_baixar")) },
    { rotulo: "Enviaram o formulário", total: Math.max(unicos(doTipo("lead")), 0) },
    { rotulo: "Baixaram", total: unicos(doTipo("download")) },
  ];
  return etapas.map((e, i) => ({ ...e, taxa: i && etapas[i - 1].total ? Math.round((e.total / etapas[i - 1].total) * 100) : null }));
});

// quebras por origem, aparelho, idioma e aba
function contar(lista, campo, nomes = {}) {
  const porV = new Map();
  lista.forEach((e) => { if (!porV.has(e.v)) porV.set(e.v, e[campo] || "outro"); });
  const cont = {};
  porV.forEach((v) => { cont[v] = (cont[v] || 0) + 1; });
  const total = porV.size || 1;
  return Object.entries(cont)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([nome, n]) => ({ nome: nomes[nome] || nome, total: n, pct: Math.round((n / total) * 100) }));
}
function contarAbas() {
  const cont = {};
  doTipo("aba").forEach((e) => { cont[e.det] = (cont[e.det] || 0) + 1; });
  const total = Object.values(cont).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(cont).sort((a, b) => b[1] - a[1]).map(([nome, n]) => ({ nome, total: n, pct: Math.round((n / total) * 100) }));
}
const quebras = computed(() => [
  { titulo: "De onde vêm", itens: contar(doTipo("visita"), "origem", { direto: "Direto", "google.com": "Google", "instagram.com": "Instagram", "l.facebook.com": "Facebook", "youtube.com": "YouTube", whatsapp: "WhatsApp" }) },
  { titulo: "Aparelho", itens: contar(doTipo("visita"), "disp", { computador: "Computador", celular: "Celular", tablet: "Tablet" }) },
  { titulo: "Idioma", itens: contar(doTipo("visita"), "idioma", { "pt-BR": "Português", en: "Inglês" }) },
  { titulo: "Abas mais clicadas", itens: contarAbas() },
]);

// ---------- leads ----------
const leadsFiltrados = computed(() => {
  const b = busca.value.toLowerCase();
  if (!b) return leads.value;
  return leads.value.filter((l) => [l.nome, l.email, l.contato, l.msg].some((x) => (x || "").toLowerCase().includes(b)));
});
const iniciais = (n) => (n || "?").split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const telefone = (c) => {
  const d = (c || "").replace(/\D/g, "");
  return d.length >= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : c;
};
const linkZap = (l) => {
  const d = (l.contato || "").replace(/\D/g, "");
  const num = d.length <= 11 ? `55${d}` : d;
  const msg = `Olá, ${l.nome.split(" ")[0]}! Aqui é o Pedro, do SubliMaster. Vi que você pediu a chave de teste de 7 dias.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
};
function quando(t) {
  const min = Math.round((Date.now() - t) / 60000);
  if (min < 60) return `há ${Math.max(1, min)} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = new Date(t);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function exportar() {
  const linhas = [["nome", "whatsapp", "email", "data"], ...leadsFiltrados.value.map((l) => [l.nome, l.contato, l.email || "", new Date(l.quando).toISOString()])];
  const csv = linhas.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  a.download = `leads-subli-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
</script>
