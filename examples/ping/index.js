import React from "react"
import { plan, scanPlans, stream } from "react-streams"
import { concat, of } from "rxjs"
import { map, tap, delay, finalize } from "rxjs/operators"

const ping = plan(
  map(state => () =>
    concat(of({ isPinging: true }), of({ isPinging: false }).pipe(delay(1000)))
  )
)

const state$ = of({ isPinging: false }).pipe(scanPlans({ ping }))

state$.subscribe(value => console.log(value))

const Ping = stream(state$)

export default () => (
  <div>
    <Ping>
      {({ isPinging, ping }) => (
        <div>
          <h2>is pinging: {JSON.stringify(isPinging)}</h2>
          <button onClick={() => ping({ isPinging: true })}>Start PING</button>
        </div>
      )}
    </Ping>
  </div>
)
