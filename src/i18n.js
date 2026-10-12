import { ref, watch } from "vue";

// Idioma do site. Padrão: inglês. Navegador em português abre em português.
// A escolha do botão fica salva neste navegador.
const CHAVE = "subli-idioma";

function inicial() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === "pt" || salvo === "en") return salvo;
  } catch (e) {
    /* sem armazenamento: segue pelo navegador */
  }
  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  return nav.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export const idioma = ref(inicial());



export const alternarIdioma = () => { idioma.value = idioma.value === "pt" ? "en" : "pt"; };

// t("hero.baixar") -> texto no idioma atual (cai no inglês se faltar)
export function t(caminho) {
  const pegar = (obj) => caminho.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const v = pegar(TEXTOS[idioma.value]);
  return v == null ? pegar(TEXTOS.en) : v;
}

export const TEXTOS = {
  en: {
    meta: { titulo: "SubliMaster" },
    app: { parar: "Stop Scripts", bandeja: "Minimize to Tray", direitos: "© 2026 SubliMaster. All rights reserved", licenca: "Lifetime license" },
    hero: {
      linhas: ["Autopilot", "for your CorelDRAW.", "Deliver effortlessly"],
      baixar: "Download for Windows",
      faixa: ["Automate the repetitive,", "and deliver the order", "in seconds"],
    },
    nav: { inicio: "Home", baixar: "Download" },
    scripts: { Repassar: "Transfer", Uniforme: "Uniform", Organizar: "Arrange", Exportar: "Export" },
    abas: {
      Repassar: { sub: "Every size", texto: "Get the art right on one template. SubliMaster copies it to every other size and centers the text on each one." },
      Uniforme: { sub: "From list to template", texto: "Paste the list the client sent on WhatsApp. Each line becomes a piece with name, number and size in place." },
      Organizar: { sub: "Ready for the plotter", texto: "Set the sheet width, spacing and margin. It fits the pieces, fills the gaps and opens a new sheet when it is full." },
      Exportar: { sub: "JPG, PNG or PDF", texto: "Every piece becomes a named file in JPG, PNG or PDF, 300 DPI, CMYK. Just like your Ctrl+E, but in batch." },
      botao: "Download for Windows",
    },
    calc: {
      rotulo: "Do the math",
      titulo: ["What changes", "in your week"],
      pergunta: "How many orders do you make per week?",
      pedido: "order",
      pedidos: "orders",
      manual: "Manual",
      subli: "With SubliMaster",
      horasArquivo: "h on files per week",
      porSemana: "orders per week",
      papel: "m of paper used",
      menosSemana: "less work per week",
      livresMes: "free per month",
      menosPapel: "less per month on paper and ink",
      nota: (min, sub, m) => `Estimated values for a 20-piece order, with ${min} min of setup by hand and ${sub} min with SubliMaster, ${m} m of paper per order, sheet 78% used by hand and 92% with Arrange, at R$ 3.50 per meter. Real results depend on your templates and the way you work.`,
    },
    instalar: {
      rotulo: "Download",
      titulo: ["Installs", "in a minute"],
      texto: "Download, open the installer and sign in with your key.",
      botao: "Download SubliMaster",
      passos: [
        { titulo: "Download", texto: "The Windows installer, straight from the website." },
        { titulo: "Open the installer", texto: "Follow the setup steps, it takes less than a minute." },
        { titulo: "Sign in with your key", texto: "Works on any computer, one at a time. Formatted or changed machines? Just sign in again." },
      ],
    },
    teste: {
      titulo: ["Try it for 7 days", "with your own templates"],
      botao: "Download for Windows",
      requisitos: ["Windows 10 or 11, 64-bit", "CorelDRAW 2020 to 2026", "No macro, VBA or plugin in Corel"],
    },
    rodape: { direitos: "© 2026 SubliMaster. All rights reserved." },
    form: {
      titulo: ["Try it free", "for 7 days"],
      texto: "Fill in your details to get your trial key.",
      nome: "Name",
      nomePh: "Your name",
      whats: "WhatsApp",
      email: "Email",
      emailPh: "you@email.com",
      enviar: "Send and download",
      enviando: "Sending...",
      confira: "Check the highlighted fields.",
      falhou: "Could not send right now. Please try again in a moment.",
    },
    baixar: {
      rotulo: "Before installing",
      ola: "Hi, I'm",
      produtor: "SubliMaster creator.",
      p1: "Since SubliMaster is new, Windows does not know the program yet. That is why, on the first install, it shows a blue warning. It is normal and only happens once.",
      p2: "Rest assured, SubliMaster has no viruses and only works inside your CorelDRAW. Any questions, message me on WhatsApp and I will answer personally.",
      naoComecou: "Download didn't start?",
      cliqueAqui: "Click here",
      portfolio: "Portfolio",
    },
    whatsAria: "Chat on WhatsApp",
    whatsMsg: "Hi Pedro! I came from the SubliMaster sales page and would like more information.",
    idioma: "English",
  },
  pt: {
    meta: { titulo: "SubliMaster" },
    app: { parar: "Parar Scripts", bandeja: "Minimizar para Bandeja", direitos: "© 2026 SubliMaster. Todos os direitos reservados", licenca: "Licença vitalícia" },
    hero: {
      linhas: ["Piloto automático", "para o seu CorelDRAW.", "Entregue sem esforço"],
      baixar: "Baixar para Windows",
      faixa: ["Automatize o repetitivo,", "e entregue o pedido", "em segundos"],
    },
    nav: { inicio: "Início", baixar: "Baixar" },
    scripts: { Repassar: "Repassar", Uniforme: "Uniforme", Organizar: "Organizar", Exportar: "Exportar" },
    abas: {
      Repassar: { sub: "Todos os tamanhos", texto: "Acerte a arte em um molde. O SubliMaster copia pra todos os outros tamanhos e centraliza os textos em cada um." },
      Uniforme: { sub: "Da lista ao molde", texto: "Cole a lista que o cliente mandou no WhatsApp. Cada linha vira uma peça com nome, número e tamanho no lugar." },
      Organizar: { sub: "No ponto pra plotter", texto: "Diga a largura da folha, o espaço e a margem. Ele encaixa as peças, aproveita os vãos e abre outra folha quando enche." },
      Exportar: { sub: "JPG, PNG ou PDF", texto: "Cada peça vira um arquivo nomeado em JPG, PNG ou PDF, 300 DPI, CMYK. Igual ao seu Ctrl+E, só que em lote." },
      botao: "Baixar para Windows",
    },
    calc: {
      rotulo: "Faça a conta",
      titulo: ["O que muda", "na sua semana"],
      pergunta: "Quantos pedidos você faz por semana?",
      pedido: "pedido",
      pedidos: "pedidos",
      manual: "Manual",
      subli: "Com o SubliMaster",
      horasArquivo: "h no arquivo por semana",
      porSemana: "pedidos por semana",
      papel: "m de papel aproveitado",
      menosSemana: "a menos de trabalho por semana",
      livresMes: "livres por mês",
      menosPapel: "a menos por mês em papel e tinta",
      nota: (min, sub, m) => `Valores estimados para um pedido de 20 peças, com ${min} min de montagem no manual e ${sub} min com o SubliMaster, ${m} m de papel por pedido, folha 78% aproveitada no manual e 92% com o Organizar, a R$ 3,50 o metro. O resultado real varia com os seus moldes e o seu jeito de trabalhar.`,
    },
    instalar: {
      rotulo: "Download",
      titulo: ["Instala", "em um minuto"],
      texto: "Baixe, abra o instalador e entre com a sua chave.",
      botao: "Baixar SubliMaster",
      passos: [
        { titulo: "Baixe", texto: "O instalador para Windows, direto do site." },
        { titulo: "Abra o instalador", texto: "Siga os passos da instalação, leva menos de um minuto." },
        { titulo: "Entre com a sua chave", texto: "Vale em qualquer computador, um por vez: formatou ou trocou de máquina, é só entrar de novo." },
      ],
    },
    teste: {
      titulo: ["Teste 7 dias", "com os seus moldes"],
      botao: "Baixar para Windows",
      requisitos: ["Windows 10 ou 11, 64 bits", "CorelDRAW 2020 a 2026", "Sem macro, VBA ou plugin no Corel"],
    },
    rodape: { direitos: "© 2026 SubliMaster. Todos os direitos reservados." },
    form: {
      titulo: ["Teste 7 dias", "grátis"],
      texto: "Preencha seus dados para receber a chave de teste.",
      nome: "Nome",
      nomePh: "Seu nome",
      whats: "WhatsApp",
      email: "E-mail",
      emailPh: "voce@email.com",
      enviar: "Enviar e baixar",
      enviando: "Enviando...",
      confira: "Confira os campos marcados.",
      falhou: "Não consegui enviar agora. Tente de novo em instantes.",
    },
    baixar: {
      rotulo: "Antes de instalar",
      ola: "Olá, eu sou o",
      produtor: "Produtor do SubliMaster.",
      p1: "Como o SubliMaster é novo, o Windows ainda não conhece o programa. Por isso, na primeira instalação, ele mostra um aviso azul. É normal e só acontece uma vez.",
      p2: "Pode ficar tranquilo, o SubliMaster não tem vírus e só trabalha dentro do seu CorelDRAW. Qualquer dúvida, me chama no WhatsApp que eu respondo pessoalmente.",
      naoComecou: "O download não começou?",
      cliqueAqui: "Clique aqui",
      portfolio: "Portfólio",
    },
    whatsAria: "Falar no WhatsApp",
    whatsMsg: "Olá, Pedro! Vim pela página de vendas do SubliMaster e gostaria de ter mais informações.",
    idioma: "Português",
  },
};

// lang e título da aba acompanham o idioma (fica no fim: precisa dos TEXTOS já definidos)
watch(idioma, (v) => {
  try { localStorage.setItem(CHAVE, v); } catch (e) { /* ignora */ }
  document.documentElement.lang = v === "pt" ? "pt-BR" : "en";
  document.title = TEXTOS[v].meta.titulo;
}, { immediate: true });
