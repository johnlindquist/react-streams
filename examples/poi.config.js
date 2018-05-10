const path = require("path")

module.exports = {
  entry: "./examples/index.js",
  env: {
    DEV: true
  },
  html: {
    template: "./examples/index.ejs"
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4322",
        pathRewrite: { "^/api": "" }
      }
    }
  },
  configureWebpack(config, context) {
    config.resolve.alias = {
      "react-streams": "../../"
    }
    config.module.rules.push({
      test: /\.md?$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              "env",
              ["@babel/preset-stage-0", { decoratorsLegacy: true }],
              "@babel/react"
            ]
          }
        },
        "@mdx-js/loader"
      ]
    })

    return config
  }
}
