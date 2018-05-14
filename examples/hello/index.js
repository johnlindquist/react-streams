import React from "react"
import { Subscribe } from "react-streams"
import { of } from "rxjs"

const hello = of({ message: "Hello, world!" })

export default () => (
  <Subscribe stream={hello}>{({ message }) => <h2>{message}</h2>}</Subscribe>
)
