import React from "react"
import { Stream, action, handler, mapActions } from "react-streams"
import { of } from "rxjs"
import { mapTo } from "rxjs/operators"

const map = ({ count }) => {
  const onInc = handler(mapTo(2))
  const onDec = handler(mapTo(-2))

  const count$ = mapActions(of(count), [
    action(onInc, num => count => count + num),
    action(onDec, num => count => count + num)
  ])

  return {
    count: count$,
    onInc,
    onDec
  }
}

export default () => (
  <Stream map={map} count={4}>
    {({ count, onInc, onDec }) => (
      <div>
        <button id="dec" onClick={onDec}>
          -
        </button>
        <span id="count">{count}</span>
        <button id="inc" onClick={onInc}>
          +
        </button>
      </div>
    )}
  </Stream>
)
