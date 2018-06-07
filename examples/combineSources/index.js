import React, { createContext } from "react"
import { Stream, combineSources, scanPlans, plan } from "react-streams"
import { of } from "rxjs"
import { map, mapTo, pluck, share, shareReplay } from "rxjs/operators"
import { CountOnly, NameAndCount, NameOnly } from "./components"

const name$ = of({ name: "John" })
const onUpdate = plan(pluck("target", "value"), map(name => () => ({ name })))

const nameState$ = name$.pipe(scanPlans({ onUpdate }), shareReplay(1))

const count$ = of({ count: 5 })
const onInc = plan(mapTo(({ count }) => ({ count: count + 1 })))
const onDec = plan(mapTo(({ count }) => ({ count: count - 1 })))

const countState$ = count$.pipe(scanPlans({ onInc, onDec }), shareReplay(1))

const source$ = combineSources(nameState$, countState$)

//for non-ui effects
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
