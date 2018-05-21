import React from "react"
import { Stream } from "react-streams"
import { map, filter } from "rxjs/operators"
import { interval } from "rxjs"

const odds = filter(({ count }) => count % 2)
const evens = filter(({ count }) => !(count % 2))

const count$ = interval(1000).pipe(map(count => ({ count })))

export default () => (
  <Stream source={count$}>
    {({ count }) => (
      <div style={{ padding: "2rem" }}>
        <h2>{count}</h2>
        <Stream count={count}>
          {({ count }) => <div>No filter: {count}</div>}
        </Stream>
        <Stream count={count} pipe={odds}>
          {({ count }) => <div>Odds: {count}</div>}
        </Stream>
        <Stream count={count} pipe={evens}>
          {({ count }) => <div>Evens: {count}</div>}
        </Stream>
      </div>
    )}
  </Stream>
)
