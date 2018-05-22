import React from "react"
import { mergePlans, plan, stream, StreamProps } from "react-streams"
import { concat, of, pipe, from } from "rxjs"
import { delay, map, pluck, switchMap } from "rxjs/operators"

const onChange = plan(pluck("target", "value"), map(message => ({ message })))

export default () => (
  <div>
    <h2>Update a Stream with Plans</h2>
    <StreamProps message="Hello" plans={{ onChange }}>
      {({ message, onChange }) => (
        <div>
          <input id="input" type="text" onChange={onChange} />
          <div id="message">{message}</div>
        </div>
      )}
    </StreamProps>
  </div>
)
