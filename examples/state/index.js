import React from "react"
import { Stream, handler, config } from "react-streams"
import { of } from "rxjs"
import { mapTo, share } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const bye = handler(mapTo({ message: "Bye" }))
const yo = handler(mapTo({ message: "yo" }))

const state$ = config(message$, {
  bye,
  yo
})

export default () => (
  <div>
    <h1>Hi</h1>
    <Stream source={state$}>
      {({ message }) => (
        <div>
          <div>{message}</div>
          <button onClick={bye}>Bye</button>
        </div>
      )}
    </Stream>
    <Stream source={state$}>
      {({ message }) => (
        <div>
          <div>{message}</div>
          <button onClick={yo}>Yo</button>
        </div>
      )}
    </Stream>
  </div>
)
