import React from "react"
import { Stream, handler } from "react-streams"
import { of } from "rxjs"
import { map, mapTo } from "rxjs/operators"

const Count = ({ start, ...props }) => {
  const count$ = of({ count: start })
  return <Stream source={count$} {...props} />
}

const handlers = {
  onInc: handler(map(() => state => ({ count: state.count + 2 }))),
  onDec: handler(map(() => state => ({ count: state.count - 2 }))),
  onReset: handler(mapTo({ count: 4 }))
}

export default () => (
  <Count start={4} handlers={handlers}>
    {({ count, onInc, onDec, onReset }) => (
      <div>
        <button id="dec" onClick={onDec}>
          -
        </button>
        <span id="count">{count}</span>
        <button id="inc" onClick={onInc}>
          +
        </button>
        <button onClick={onReset}>Reset</button>
      </div>
    )}
  </Count>
)
