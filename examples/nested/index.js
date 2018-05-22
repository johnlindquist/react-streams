import React from "react"
import { Stream, StreamProps } from "react-streams"
import { map, filter } from "rxjs/operators"
import { interval } from "rxjs"

const count$ = interval(1000).pipe(map(count => ({ count })))

const odds = filter(({ count }) => count % 2)
const evens = filter(({ count }) => !(count % 2))

export default () => (
  <Stream source={count$}>
    {({ count }) => (
      <div style={{ padding: "2rem" }}>
        <h2>Stream with Nested StreamProps Components</h2>
        <StreamProps count={count}>
          {({ count }) => <div>No filter: {count}</div>}
        </StreamProps>
        <StreamProps count={count} pipe={odds}>
          {({ count }) => <div>Odds: {count}</div>}
        </StreamProps>
        <StreamProps count={count} pipe={evens}>
          {({ count }) => <div>Evens: {count}</div>}
        </StreamProps>
      </div>
    )}
  </Stream>
)
