import React from "react"
import { streamProps } from "react-streams"
import { map } from "rxjs/operators"

const mapGreeting = map(({ greeting, name }) => ({
  message: `${greeting}, ${name}!`
}))

const HelloWorld = streamProps(mapGreeting)

export default () => (
  <div>
    <h2>Stream Props to Children</h2>
    <HelloWorld greeting="Hello" name="world">
      {({ message }) => <div>{message}</div>}
    </HelloWorld>
    <HelloWorld greeting="Bonjour" name="John">
      {({ message }) => <div>{message}</div>}
    </HelloWorld>
  </div>
)
