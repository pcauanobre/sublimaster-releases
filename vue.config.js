const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",
  productionSourceMap: false,
  // aceita abrir pelo endereço do túnel (cloudflared), não só localhost
  devServer: { allowedHosts: "all" },
});
