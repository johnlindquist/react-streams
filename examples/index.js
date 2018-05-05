import React from "react"
import { render } from "react-dom"
import Loadable from "react-loadable"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

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
    <Switch>
      <ExampleRoute path="/basic" />
      <ExampleRoute path="/text" />
      <ExampleRoute path="/counter" />
    </Switch>
  </Router>,
  document.querySelector("#app")
)
