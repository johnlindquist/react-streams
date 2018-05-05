import React from "react"
import { render } from "react-dom"
import Counter from "../examples/counter"
import CounterDocs from "../examples/counter/README.md"

const App = () => (
  <div>
    <CounterDocs />
    <Counter />
  </div>
)

render(<App />, document.querySelector("#app"))
