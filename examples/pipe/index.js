import React from "react"
import { Stream } from "react-streams"
import { pipe } from "rxjs"
import { delay, startWith } from "rxjs/operators"

const startWithAndDelay = (message, time) =>
  pipe(delay(time), startWith({ message }))

export default () => (
  <div>
    <Stream message="Hello" pipe={startWithAndDelay("Wait...", 500)}>
      {({ message }) => <div>{message}</div>}
    </Stream>
    <Stream message="Later" pipe={startWithAndDelay("Starting...", 3000)}>
      {({ message }) => <div>{message}</div>}
    </Stream>
  </div>
)
