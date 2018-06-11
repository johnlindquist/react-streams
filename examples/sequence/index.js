import React from "react"
import { plan, scanPlans, stream } from "react-streams"
import { of } from "rxjs"
import { delay, map, sample, shareReplay, tap } from "rxjs/operators"

const ping = plan(map(state => () => ({ isPinging: true })))

const pong = plan(map(state => () => ({ isPinging: false })))

const tapWhen = (notifier, fn, ...pipe) => source => {
  source
    .pipe(
      sample(notifier),
      ...pipe,
      tap(fn)
    )
    .subscribe()
  return source
}

const state$ = of({ isPinging: false })
  .pipe(
    scanPlans({ ping, pong }),
    shareReplay(1)
  )
  .pipe(tapWhen(ping, pong, delay(1000)))

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
