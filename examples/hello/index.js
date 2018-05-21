import React from "react"
import { stream } from "react-streams"
import { map } from "rxjs/operators"

const mapGreeting = map(({ greeting, name }) => ({
  message: `${greeting}, ${name}!`
}))

const HelloWorld = stream(mapGreeting)

export default () => (
  <HelloWorld greeting="Hello" name="world">
    {({ message }) => <h2>{message}!</h2>}
  </HelloWorld>
)
