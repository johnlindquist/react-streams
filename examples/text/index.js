import React from "react"
import { Stream, handler } from "react-streams"
import { delay, map, tap, pluck } from "rxjs/operators"
import { of } from "rxjs"

const text$ = of({ message: "Hello" })

const onChange = handler(
  pluck("target", "value"),
  delay(250),
  map(message => ({ message }))
)

export default () => (
  <Stream source={text$} handlers={{ onChange }}>
    {({ message, onChange }) => (
      <div>
        <input id="input" type="text" onChange={onChange} />
        <div id="message">{message}</div>
      </div>
    )}
  </Stream>
)
