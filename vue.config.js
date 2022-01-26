const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: "/Crisps/",
  assetsDir: "static",
  outputDir: "docs",
  productionSourceMap: true,
  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
  },
};
