// rollup.config.js
import typescript from "rollup-plugin-typescript2"

module.exports = [
  {
    input: "src/index.ts",
    output: {
      file: "dist/react-streams.esm.js",
      format: "es"
    },
    plugins: [typescript()],
    external: ["react", "rxjs", "rxjs/operators"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/react-streams.js",
      format: "umd",
      name: "ReactStreams",
      globals: {
        react: "React",
        rxjs: "Rx"
      }
    },
    external: ["react", "rxjs", "rxjs/operators"],

    plugins: [typescript()]
  }
]
