import React from "react"
import { Stream } from "react-streams"
import { of } from "rxjs"
import { delay, startWith } from "rxjs/operators"

const source$ = of({ message: "Hello" }).pipe(
  delay(1000),
  startWith({ message: "Wait..." })
)

export default () => (
  <Stream source={source$}>{({ message }) => <div>{message}</div>}</Stream>
)
