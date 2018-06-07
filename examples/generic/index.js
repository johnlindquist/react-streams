import React from "react"
import { Stream } from "react-streams"
import { of, pipe, merge, concat, never, empty } from "rxjs"
import {
  delay,
  startWith,
  map,
  tap,
  mergeAll,
  switchAll,
  mergeMap,
  pairwise,
  concatAll,
  scan,
  skip,
  concatMap,
  first
} from "rxjs/operators"

const startWithAndDelay = (message, time) =>
  pipe(delay(time), startWith({ message }))

const message$ = of({ message: "Hello" })

export default () => (
  <div>
    <h2>Stream as a Component</h2>
    <Stream source={message$} pipe={startWithAndDelay("Wait...", 500)}>
      {({ message }) => <div>{message}</div>}
    </Stream>
    <Stream source={message$} pipe={startWithAndDelay("Wait longer...", 3000)}>
      {({ message }) => <div>{message}</div>}
    </Stream>
  </div>
)

const map1 = map(({ message }) => message + "1")
const map2 = map(({ message }) => message + "2")
const map3 = map(({ message }) => message + "3")
const source$ = concat(
  of({ message: "hi" }),
  of(map1).pipe(delay(100)),
  of(scan(() => "bye")).pipe(delay(100)),
  of(map2).pipe(delay(200)),
  of(map3).pipe(delay(300))
)

source$
  .pipe(source =>
    source.pipe(
      mergeMap(
        (prev, operator) =>
          operator instanceof Function ? of(source).pipe(operator) : of(source)
      ),
      concatAll()
    )
  )

  .subscribe(console.log.bind(console))
