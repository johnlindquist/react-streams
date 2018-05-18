import React from "react"
import { stream } from "react-streams"
import { of, pipe } from "rxjs"
import { delay, startWith, switchMap } from "rxjs/operators"

const startWithAndDelay = (startMessage, time) =>
  pipe(
    switchMap(({ message }) => of({ message })),
    delay(time),
    startWith({ message: startMessage })
  )

const Basic = stream(startWithAndDelay("Wait...", 1000))

export default () => (
  <Basic message={"Hello"}>{({ message }) => <div>{message}</div>}</Basic>
)
