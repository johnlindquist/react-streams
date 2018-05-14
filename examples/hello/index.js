import React from "react"
import { Stream } from "react-streams"
import { of } from "rxjs"

const hello$ = of({ message: "Hello, world!" })

export default () => (
  <Stream source={hello$}>{({ message }) => <h2>{message}</h2>}</Stream>
)
