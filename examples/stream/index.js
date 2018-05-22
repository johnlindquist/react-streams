import React from "react"
import { stream } from "react-streams"
import { interval } from "rxjs"
import { map } from "rxjs/operators"

const count$ = interval(250).pipe(map(count => ({ count })))

const Counter = stream(count$)

export default () => (
  <div>
    <h2>Subscribe to a Stream</h2>
    <Counter>{({ count }) => <div>{count}</div>}</Counter>
  </div>
)
