/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      fontFamily: {
        // títulos: sans pesada e fechada, cara de software (não de revista)
        display: ['"Geist"', "system-ui", "sans-serif"],
        sans: ['"Geist"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#0E0E0C",
        page: "#FFFFFF",
        panel: "#F5F5F3",
        line: "#E7E6E2",
        muted: "#8A8984",
        // mesmo navy e azul do app (ui/design.css do SubliMaster)
        noite: "#0B1222",
        azul: "#3B82F6",
        "azul-claro": "#8DB8FF",
        // as três gotas do logo (tintas de sublimação)
        ciano: "#2AA9E0",
        magenta: "#F0376F",
        amarelo: "#F2C230",
      },
      borderRadius: {
        frame: "28px",
        card: "18px",
      },
      keyframes: {
        sobe: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        foca: {
          "0%": { opacity: "0", filter: "blur(12px)", transform: "translateY(8px)" },
          "100%": { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
        surge: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        flutua: {
          "0%": { opacity: "0", transform: "translateY(18px) scale(.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        nuvem: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-6%)" },
        },
        // janela do SubliMaster entra deslizando da direita
        janela: {
          "0%": { opacity: "0", transform: "translate3d(40px,10px,0) scale(.96)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0) scale(1)" },
        },
        pisca: {
          "0%, 100%": { opacity: ".25" },
          "50%": { opacity: "1" },
        },
        // brilhos do fundo sobem e descem só pelas laterais, sem cruzar o centro
        deriva1: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(6%,-85%,0) scale(1.1)" },
        },
        deriva2: {
          "0%, 100%": { transform: "translate3d(0,-85%,0) scale(1.1)" },
          "50%": { transform: "translate3d(-6%,0,0) scale(1)" },
        },
        respira: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: ".75" },
          "50%": { transform: "translate3d(2%,-3%,0) scale(1.08)", opacity: "1" },
        },
      },
      animation: {
        sobe: "sobe 1.3s cubic-bezier(.16,1,.3,1) both",
        foca: "foca 1.2s cubic-bezier(.16,1,.3,1) both",
        surge: "surge 1s cubic-bezier(.16,1,.3,1) both",
        flutua: "flutua 1s cubic-bezier(.16,1,.3,1) both",
        nuvem: "nuvem 40s linear infinite alternate",
        janela: "janela 1s cubic-bezier(.16,1,.3,1) both",
        pisca: "pisca 6s ease-in-out infinite",
        respira: "respira 12s ease-in-out infinite",
        deriva1: "deriva1 14s ease-in-out infinite",
        deriva2: "deriva2 17s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
