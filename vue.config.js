const path = require("path");

module.exports = {
  pluginOptions: {
    // electronBuilder https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html#
    electronBuilder: {
      // nodeIntegration: true,
      mainProcessFile: "src/main/background.ts",
      mainProcessWatch: ["src/**/*.ts"], // Hot Reload  https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/741
      externals: ["typeorm", "sqlite3", "socket.io", "serialport"], // disable warnnings https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/699
    },
  },
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "assets",
  pages: {
    index: {
      entry: "src/main.ts",
    },
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "font-size-base": "16px",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    devtool: "source-map",
    resolve: {
      modules: [path.resolve(__dirname, "../backend/src"), "ics"],
      extensions: [".ts", ".tsx", ".js"],
    },
  },
  chainWebpack: (config) => {
  },
  parallel: false,
};
