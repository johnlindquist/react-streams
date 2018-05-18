import React from "react"
import { stream, plan, converge } from "react-streams"
import { merge, of, pipe } from "rxjs"
import { delay, map, pluck, scan, switchMap, mapTo, tap } from "rxjs/operators"

const getValueThenDelay = pipe(
  pluck("target", "value"),
  delay(250),
  map(message => () => ({ message }))
)

const onChange = plan(getValueThenDelay)

const TextDemo = stream(converge({ onChange }))

export default () => (
  <TextDemo message="Hello">
    {({ message, onChange }) => (
      <div>
        <input id="input" type="text" onChange={onChange} />
        <div id="message">{message}</div>
      </div>
    )}
  </TextDemo>
)
