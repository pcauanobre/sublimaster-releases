import { ref, computed } from "vue";

// Dados do /admin: login no Firebase Auth (conta com permissão de admin),
// leitura de leads/ e site/acessos.
const API_KEY = "AIzaSyAp4Frfttp3CCY_oMAHdXxrVeod_MHnCao";
const DB = "https://sublimaster-e3704-default-rtdb.firebaseio.com";
const SESSAO = "subli-admin";

const DIA = 86400000;

export function useAdmin() {
  const token = ref(null);
  const entrando = ref(false);
  const erroLogin = ref("");
  const carregando = ref(false);
  const erroDados = ref("");
  const dias = ref(30);
  const leadsReais = ref([]);
  const eventosReais = ref([]);

  // ---------- login ----------
  async function entrar(email, senha) {
    entrando.value = true;
    erroLogin.value = "";
    try {
      const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha, returnSecureToken: true }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error && j.error.message);
      guardar(j.idToken, j.refreshToken, j.expiresIn);
      await carregar();
    } catch (e) {
      erroLogin.value = "E-mail ou senha incorretos.";
    } finally {
      entrando.value = false;
    }
  }

  function guardar(id, refresh, expira) {
    token.value = id;
    try {
      sessionStorage.setItem(SESSAO, JSON.stringify({ refresh, ate: Date.now() + Number(expira) * 1000 - 60000, id }));
    } catch (e) { /* sem armazenamento */ }
  }

  // volta a sessão desta aba sem pedir a senha de novo
  async function retomar() {
    let s;
    try { s = JSON.parse(sessionStorage.getItem(SESSAO) || "null"); } catch (e) { s = null; }
    if (!s) return false;
    if (s.ate > Date.now()) { token.value = s.id; return true; }
    try {
      const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(s.refresh)}`,
      });
      const j = await r.json();
      if (!r.ok) throw new Error();
      guardar(j.id_token, j.refresh_token, j.expires_in);
      return true;
    } catch (e) {
      sair();
      return false;
    }
  }

  function sair() {
    token.value = null;
    leadsReais.value = [];
    eventosReais.value = [];
    try { sessionStorage.removeItem(SESSAO); } catch (e) { /* ignora */ }
  }

  // ---------- dados ----------
  async function lerNo(caminho, desde) {
    const q = `orderBy=${encodeURIComponent('"quando"')}&startAt=${desde}&auth=${token.value}`;
    const r = await fetch(`${DB}/${caminho}.json?${q}`);
    if (r.status === 401) throw new Error("sem-permissao");
    if (!r.ok) throw new Error(String(r.status));
    const j = (await r.json()) || {};
    return Object.entries(j).map(([id, v]) => ({ id, ...v }));
  }

  async function carregar() {
    if (!token.value) return;
    carregando.value = true;
    erroDados.value = "";
    const desde = Date.now() - 90 * DIA;   // sempre 90 dias; o filtro de período é local
    try {
      const [l, e] = await Promise.all([lerNo("leads", desde), lerNo("site/acessos", desde)]);
      leadsReais.value = l.sort((a, b) => b.quando - a.quando);
      eventosReais.value = e;
    } catch (e) {
      if (e.message === "sem-permissao") {
        // sessão vencida ou conta sem permissão: volta para o login
        sair();
        erroLogin.value = "Sua sessão expirou. Entre de novo.";
      } else {
        erroDados.value = "Não consegui carregar os dados. Se usa bloqueador de anúncio, libere este site.";
        setTimeout(() => { erroDados.value = ""; }, 8000);
      }
    } finally {
      carregando.value = false;
    }
  }

  // ---------- excluir lead (e as visitas da mesma pessoa) ----------
  async function excluirLead(lead) {
    const mudancas = { [`leads/${lead.id}`]: null };
    if (lead.v) eventosReais.value.filter((e) => e.v === lead.v).forEach((e) => { mudancas[`site/acessos/${e.id}`] = null; });
    const r = await fetch(`${DB}/.json?auth=${token.value}`, { method: "PATCH", body: JSON.stringify(mudancas) });
    if (!r.ok) throw new Error(String(r.status));
    leadsReais.value = leadsReais.value.filter((l) => l.id !== lead.id);
    if (lead.v) eventosReais.value = eventosReais.value.filter((e) => e.v !== lead.v);
  }

  // ---------- recorte pelo período ----------
  const fonteLeads = computed(() => leadsReais.value);
  const fonteEventos = computed(() => eventosReais.value);
  const inicio = computed(() => Date.now() - dias.value * DIA);
  const leads = computed(() => fonteLeads.value.filter((l) => l.quando >= inicio.value));
  const eventos = computed(() => fonteEventos.value.filter((e) => e.quando >= inicio.value));

  return {
    token, entrando, erroLogin, carregando, erroDados, dias,
    leads, eventos, fonteLeads, fonteEventos, entrar, retomar, sair, carregar, excluirLead,
  };
}
