import React from "react"
import { Stream, converge, plan } from "react-streams"
import { of } from "rxjs"
import { map, mapTo } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const date = plan(
  map(() => ({
    message: new Date().toLocaleDateString()
  }))
)
const bye = plan(mapTo({ message: "Bye" }))
const yo = plan(mapTo({ message: "Yo" }))

const state$ = converge(message$, date, bye, yo)

export default () => (
  <div>
    <Stream source={state$}>
      {({ message }) => (
        <div>
          <div id="message">{message}</div>
          <button onClick={date} aria-label="show date message">
            Date
          </button>
          <button onClick={bye} aria-label="show bye message">
            Bye
          </button>
          <button onClick={yo} aria-label="show yo message">
            Yo
          </button>
        </div>
      )}
    </Stream>
  </div>
)
