const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: "/crisps/",
  assetsDir: "static",
  outputDir: "doc",
  productionSourceMap: false,
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
