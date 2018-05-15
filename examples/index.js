import React, { Fragment } from "react"
import { render } from "react-dom"
import Loadable from "react-loadable"
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"
import "./index.css"

const examples = [
  "hello",
  "basic",
  "ajax",
  "text",
  "counter",
  "converge",
  "todos",
  "context",
  "combineState"
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
    <Fragment>
      <nav style={{ display: "flex", flexWrap: "wrap" }}>
        {examples.map(example => (
          <Link style={{ padding: "1rem" }} key={example} to={`/${example}`}>
            {example}
          </Link>
        ))}
      </nav>
      <Switch>
        {examples.map(example => (
          <ExampleRoute key={example} path={`/${example}`} />
        ))}
      </Switch>
    </Fragment>
  </Router>,
  document.querySelector("#root")
)
