import React from "react"
import { Stream, getTargetValue, handler } from "react-streams"
import { delay, map } from "rxjs/operators"
import { of } from "rxjs"

const state = { message: "Hello" }

const onChange = handler(
  getTargetValue,
  delay(250),
  map(message => state => ({ ...state, message }))
)

export default () => (
  <Stream state={state} handlers={{ onChange }}>
    {({ message }, { onChange }) => (
      <div>
        <input id="input" type="text" onChange={onChange} />
        <div id="message">{message}</div>
      </div>
    )}
  </Stream>
)
