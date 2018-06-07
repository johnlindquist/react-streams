import React from "react"
import { plan, stream } from "react-streams"
import { scan, startWith } from "rxjs/operators"

const planState = plan(
  startWith({ count: 0 }),
  scan((state, fn) => (fn instanceof Function ? fn(state) : fn))
)
const Counter = stream(planState)

const inc = () => planState(({ count }) => ({ count: count + 1 }))
const dec = () => planState(({ count }) => ({ count: count - 1 }))

export default () => (
  <Counter>
    {({ count }) => (
      <div>
        <button onClick={inc}>+</button>
        <h2>{count}</h2>
        <button onClick={dec}>-</button>
      </div>
    )}
  </Counter>
)
