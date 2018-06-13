import React from "react"
import { Stream, stream } from "react-streams"
import { of, pipe } from "rxjs"
import { delay, startWith, switchMap } from "rxjs/operators"

const startWithAndDelay = (startMessage, time) =>
  pipe(
    switchMap(({ message }) => of({ message })),
    delay(time),
    startWith({ message: startMessage })
  )

const startWithWaitDelay500 = startWithAndDelay("Wait...", 500)

const props = {
  message: "Hello",
  render: ({ message }) => <div>{message}</div>
}
const message$ = of(props)

const MessageStream = stream(startWithWaitDelay500)
const MessageStreamNeedsPipe = stream()

export default () => (
  <div>
    <Stream {...props} pipe={startWithWaitDelay500} />
    <MessageStream {...props} />
    <MessageStreamNeedsPipe {...props} pipe={startWithWaitDelay500} />
  </div>
)
