import React from "react"
import { Subscribe } from "react-streams"
import { of } from "rxjs"
import { map } from "rxjs/operators"

const message$ = of({ greeting: "Hello", name: "world", message: "yay" })

const myPipe = map(({ greeting, name }) => ({
  message: `${greeting}, ${name}!`
}))

export default () => (
  <Subscribe source={message$} pipe={myPipe}>
    {({ message }) => <h2>{message}</h2>}
  </Subscribe>
)
