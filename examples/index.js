import React from "react"
import { render } from "react-dom"
import Loadable from "react-loadable"
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"
import "./index.css"

const examples = [
  "basic",
  "text",
  "counter",
  "todos",
  "state",
  "store",
  "share",
  "streamState",
  "streamToComponent"
]

const ExampleRoute = props => (
  <Route
    {...props}
    render={() => {
      const Example = Loadable({
        loader: () => import(`.${props.path}`),
        loading: () => null
      })
      return <Example />
    }}
  />
)

render(
  <Router>
    <>
      {examples.map(example => (
        <Link style={{ padding: "1rem" }} key={example} to={`/${example}`}>
          {example}
        </Link>
      ))}
      <Switch>
        {examples.map(example => (
          <ExampleRoute key={example} path={`/${example}`} />
        ))}
      </Switch>
    </>
  </Router>,
  document.querySelector("#app")
)
