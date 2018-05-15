import React from "react"
import { Stream, plan } from "react-streams"
import { merge, of } from "rxjs"
import { delay, map, pluck, scan } from "rxjs/operators"

const text$ = of({ message: "Hello" })

const onChange = plan(
  pluck("target", "value"),
  delay(250),
  map(message => ({ message }))
)

const state$ = merge(text$, onChange).pipe(
  scan((state = {}, patch) => {
    return { ...state, ...patch }
  })
)

export default () => (
  <Stream source={state$} onChange={onChange}>
    {({ message, onChange }) => (
      <div>
        <input id="input" type="text" onChange={onChange} />
        <div id="message">{message}</div>
      </div>
    )}
  </Stream>
)
