import React from "react"
import { plan, scanPlans, stream, tapWhen } from "react-streams"
import { of } from "rxjs"
import { delay } from "rxjs/operators"

const ping = plan({ isPinging: true })

const pong = plan({ isPinging: false })

const state$ = of({ isPinging: false }).pipe(
  scanPlans({ ping, pong }),
  tapWhen(ping, pong, delay(1000))
)

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
