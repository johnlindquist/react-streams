import React from "react"
import { Stream } from "react-streams"
import { delay, startWith } from "rxjs/operators"
import { of, pipe } from "rxjs"

const source$ = of({ message: "Hello" }).pipe(
  delay(1000),
  startWith({ message: "Wait..." })
)

export default () => (
  <Stream source={source$}>{({ message }) => <div>{message}</div>}</Stream>
)
