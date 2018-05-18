import React from "react"
import { stream } from "react-streams"
import { of } from "rxjs"
import { switchMap } from "rxjs/operators"

const HelloWorld = stream(
  switchMap(({ greeting, name }) => of({ message: `${greeting}, ${name}` }))
)

export default () => (
  <HelloWorld greeting="Hello" name="world">
    {({ message }) => <h2>{message}</h2>}
  </HelloWorld>
)
