<template>
  <main class="p-2 md:p-3">
    <!-- Formulário da chave de teste de 7 dias: grava em leads/ no Firebase e,
         ao enviar, segue para a página do download (aviso azul). -->
    <div class="relative flex min-h-[calc(100svh-16px)] flex-col overflow-hidden rounded-frame text-white md:min-h-[calc(100vh-24px)]">
      <FundoPixel />

      <header class="relative z-20 flex shrink-0 items-center justify-center px-5 pt-5 md:pt-6">
        <RouterLink to="/" class="flex animate-foca items-center gap-2 text-[15px] font-semibold tracking-tight">
          <img src="/logo.png" alt="" class="h-7 w-7" />
          SubliMaster
        </RouterLink>
        <button
          class="absolute right-5 top-5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/85 transition hover:bg-white/10 md:right-7 md:top-6"
          :title="t('idioma') === 'English' ? 'Mudar para português' : 'Switch to English'"
      @click="alternarIdioma"
        >
          <span class="flex items-center gap-1.5"><svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>{{ t("idioma") }}</span>
        </button>
      </header>

      <div class="relative z-10 flex flex-1 items-center justify-center px-5 py-10">
        <div class="w-full max-w-[460px]">
          <h1 class="animate-foca text-center font-display text-[36px] leading-[1.05] md:text-[48px] [animation-delay:.15s]">
            {{ t("form.titulo")[0] }} <span class="text-azul-claro">{{ t("form.titulo")[1] }}</span>
          </h1>
          <p class="mt-3 animate-foca text-center text-[15px] text-white/60 [animation-delay:.25s]">
            {{ t("form.texto") }}
          </p>

          <form
            class="mt-8 animate-flutua space-y-3 rounded-[22px] border border-white/10 bg-white/[.05] p-5 backdrop-blur md:p-6 [animation-delay:.35s]"
            novalidate
            @submit.prevent="enviar"
          >
            <label class="block">
              <span class="text-[12px] text-white/60">{{ t("form.nome") }}</span>
              <input v-model.trim="nome" autocomplete="name" class="campo mt-1" :class="{ 'campo-erro': erros.nome }" :placeholder="t('form.nomePh')" />
            </label>
            <label class="block">
              <span class="text-[12px] text-white/60">{{ t("form.whats") }}</span>
              <input
                v-model="numero"
                inputmode="tel"
                autocomplete="tel"
                class="campo mt-1"
                :class="{ 'campo-erro': erros.numero }"
                placeholder="(85) 99999-9999"
                @input="mascarar"
              />
            </label>
            <label class="block">
              <span class="text-[12px] text-white/60">{{ t("form.email") }}</span>
              <input v-model.trim="email" type="email" autocomplete="email" class="campo mt-1" :class="{ 'campo-erro': erros.email }" :placeholder="t('form.emailPh')" />
            </label>
            <!-- campo escondido: só robô preenche -->
            <input v-model="armadilha" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

            <p v-if="mensagem" class="text-[13px] text-[#fca5a5]">{{ mensagem }}</p>

            <button
              type="submit"
              class="mt-2 w-full rounded-xl bg-azul py-3 text-[15px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,.8)] transition hover:bg-[#2563EB] disabled:opacity-60"
              :disabled="enviando"
            >
              {{ enviando ? t("form.enviando") : t("form.enviar") }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import FundoPixel from "../components/FundoPixel.vue";
import { t, alternarIdioma } from "../i18n";

const LEADS_URL = "https://sublimaster-e3704-default-rtdb.firebaseio.com/leads.json";
const router = useRouter();

const nome = ref("");
const numero = ref("");
const email = ref("");
const armadilha = ref("");
const enviando = ref(false);
const mensagem = ref("");
const erros = reactive({ nome: false, numero: false, email: false });

// (85) 99999-9999 enquanto digita
function mascarar() {
  const d = numero.value.replace(/\D/g, "").slice(0, 11);
  let s = d;
  if (d.length > 2) s = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) s = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  numero.value = s;
}

async function enviar() {
  if (enviando.value) return;   // trava duplo clique
  mensagem.value = "";
  const digitos = numero.value.replace(/\D/g, "");
  erros.nome = nome.value.length < 2;
  erros.numero = digitos.length < 10;
  erros.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (erros.nome || erros.numero || erros.email) {
    mensagem.value = t("form.confira");
    return;
  }
  if (armadilha.value) return;

  enviando.value = true;
  try {
    const r = await fetch(LEADS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nome.value.slice(0, 80),
        contato: digitos,
        email: email.value.slice(0, 120),
        origem: "lp-teste",
        quando: { ".sv": "timestamp" },
      }),
    });
    if (!r.ok) throw new Error(String(r.status));
  } catch (e) {
    enviando.value = false;
    mensagem.value = t("form.falhou");
    return;
  }
  registrar("lead");
  router.push({ name: "baixar" });
}
</script>
