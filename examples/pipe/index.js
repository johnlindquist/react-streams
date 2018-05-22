import React from "react"
import { stream } from "react-streams"
import { of } from "rxjs"
import { map } from "rxjs/operators"

const stream$ = of({ greeting: "Hello", name: "world" })
const mapToMessage = map(({ greeting, name }) => ({
  message: `${greeting}, ${name}!`
}))

const Greeting = stream(stream$, mapToMessage)

export default () => (
  <div>
    <h2>Pipe Stream Values</h2>
    <Greeting>{({ message }) => <div>{message}</div>}</Greeting>
  </div>
)
