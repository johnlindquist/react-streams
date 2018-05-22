import React from "react"
import { Stream } from "react-streams"
import { of, pipe } from "rxjs"
import { delay, startWith } from "rxjs/operators"

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
