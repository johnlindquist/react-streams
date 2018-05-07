import React from "react"
import { streamToComponent } from "react-streams"
import { of } from "rxjs"

const state = { message: "Hello" }
const state$ = of(state)
const StateContainer = streamToComponent(state$)

export default () => (
  <StateContainer>{({ message }) => <div>{message}</div>}</StateContainer>
)
