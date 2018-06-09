import React, { createContext } from "react"
import { combineSources, plan, scanPlans, Stream } from "react-streams"
import { map, mapTo, pluck } from "rxjs/operators"
import { CountOnly, NameAndCount, NameOnly } from "./components"
import { of } from "rxjs"

const nameState$ = of({ name: "John" }).pipe(
  scanPlans({
    onUpdate: plan(pluck("target", "value"), map(name => () => ({ name })))
  })
)

const countState$ = of({ count: 5 }).pipe(
  scanPlans({
    onInc: plan(mapTo(({ count }) => ({ count: count + 1 }))),
    onDec: plan(mapTo(({ count }) => ({ count: count - 1 })))
  })
)

const source$ = combineSources(nameState$, countState$)

//for non-ui effectss
source$.subscribe(state => console.log(state))

const { Consumer } = createContext({ source$ })
const NameAndCountStream = props => (
  <Consumer
    children={({ source$ }) => <Stream source={source$} {...props} />}
  />
)

export default () => (
  <div>
    <NameAndCountStream render={NameOnly} />
    <NameAndCountStream render={CountOnly} />
    <NameAndCountStream render={NameAndCount} />

    {/* Simulating late subscribers */}
    <NameAndCountStream>
      {({ name }) =>
        name.length > 4 ? <NameAndCountStream render={NameAndCount} /> : null
      }
    </NameAndCountStream>
    <NameAndCountStream>
      {({ count }) =>
        count > 5 ? <NameAndCountStream render={NameAndCount} /> : null
      }
    </NameAndCountStream>
  </div>
)
