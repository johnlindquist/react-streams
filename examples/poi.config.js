const path = require("path")

module.exports = {
  progress: false,
  entry: "index.js",
  html: {
    template: "../cypress/index.ejs"
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
    debugger
    config.resolve.alias = {
      "react-streams": path.resolve(__dirname, "../dist/index.js")
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
