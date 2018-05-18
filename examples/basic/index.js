import React from "react"
import { stream } from "react-streams"
import { pipe } from "rxjs"
import { delay, startWith } from "rxjs/operators"

const startWithAndDelay = (message, time) =>
  pipe(delay(time), startWith({ message }))

const MessageStream = stream(startWithAndDelay("Wait...", 500))

export default () => (
  <MessageStream message="Hello">
    {({ message }) => <div>{message}</div>}
  </MessageStream>
)
