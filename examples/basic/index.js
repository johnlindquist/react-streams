import React from "react"
import { Stream } from "react-streams"
import { delay, startWith } from "rxjs/operators"

const state = { message: "Hello" }
const ops = [delay(2000), startWith({ message: "Wait..." })]

export default () => (
  <Stream state={state} pipe={ops}>
    {({ message }) => <div>{message}</div>}
  </Stream>
)
