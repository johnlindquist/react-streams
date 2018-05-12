import React from "react"
import { Stream, handler } from "react-streams"
import { of } from "rxjs"
import { map } from "rxjs/operators"

const state = { count: 4 }

const handlers = {
  onInc: handler(map(() => state => ({ count: state.count + 2 }))),
  onDec: handler(map(() => state => ({ count: state.count - 2 }))),
  onReset: handler(map(() => ({ count: 4 })))
}

export default () => (
  <Stream state={state} handlers={handlers}>
    {({ count }, { onInc, onDec, onReset }) => (
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
  </Stream>
)
