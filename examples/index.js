import React, { Fragment } from "react"
import { render } from "react-dom"
import Loadable from "react-loadable"
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  Redirect
} from "react-router-dom"
import "./index.css"

const examples = [
  "generic",
  "stream",
  "pipe",
  "streamProps",
  "ajax",
  "nested",
  "plans",
  "mergePlans",
  "counter",
  "todos",
  "drag",
  "context",
  "mergeSources",
  "stepper"
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
      <div style={{ padding: "2rem" }}>
        <Switch>
          <Redirect exact from="/" to="/generic" />
          {examples.map(example => (
            <ExampleRoute key={example} path={`/${example}`} />
          ))}
        </Switch>
      </div>
    </Fragment>
  </Router>,
  document.querySelector("#root")
)
