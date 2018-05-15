import React from "react"
import { Stream, plan } from "react-streams"
import { merge, of } from "rxjs"
import { map, scan, tap } from "rxjs/operators"

const Count = ({ start, ...props }) => {
  const count$ = of({ count: start })
  const onInc = plan(map(() => state => ({ count: state.count + 2 })))
  const onDec = plan(map(() => state => ({ count: state.count - 2 })))
  const onReset = plan(map(() => state => ({ count: 4 })))

  const state$ = merge(count$, onInc, onDec, onReset).pipe(
    scan((state = {}, updater) => updater(state)),
    tap(state => console.log(`state`, state))
  )
  return <Stream source={state$} {...{ onInc, onDec, onReset, ...props }} />
}

export default () => (
  <Count start={4}>
    {({ count, onInc, onDec, onReset }) => (
      <div>
        <button id="dec" onClick={onDec} aria-label="decrement">
          -
        </button>
        <span id="count" aria-label="count">
          {count}
        </span>
        <button id="inc" onClick={onInc} aria-label="increment">
          +
        </button>
        <button onClick={onReset} aria-label="reset">
          Reset
        </button>
      </div>
    )}
  </Count>
)
