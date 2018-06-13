import React from "react"
import { assign, plan, stream } from "react-streams"
import { concat, of } from "rxjs"
import { delay, switchMap, startWith } from "rxjs/operators"

const ping = plan(
  switchMap(() =>
    concat(of({ isPinging: true }), of({ isPinging: false }).pipe(delay(1000)))
  ),
  startWith({ isPinging: false })
)

const Ping = stream(ping, assign({ ping }))

export default () => (
  <div>
    <h2>Ping</h2>
    <Ping>
      {({ isPinging, ping }) => (
        <div>
          <h2>is pinging: {JSON.stringify(isPinging)}</h2>
          <button onClick={ping}>Start PING</button>
        </div>
      )}
    </Ping>
  </div>
)
