import React from "react"
import { StreamProps, plan, scanPlans } from "react-streams"
import { map, pluck } from "rxjs/operators"

const onChange = plan(pluck("target", "value"), map(message => ({ message })))

export default () => (
  <div>
    <h2>Update a Stream with Plans</h2>
    <StreamProps message="Hello" pipe={scanPlans({ onChange })}>
      {({ message, onChange }) => (
        <div>
          <input id="input" type="text" onChange={onChange} />
          <div id="message">{message}</div>
        </div>
      )}
    </StreamProps>
  </div>
)
