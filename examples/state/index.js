import React from "react"
import { componentFromStream } from "react-streams"
import { of } from "rxjs"

const state = { message: "Hello" }
const state$ = of(state)
const StateContainer = componentFromStream(state$)

export default () => (
  <StateContainer>{({ message }) => <div>{message}</div>}</StateContainer>
)
