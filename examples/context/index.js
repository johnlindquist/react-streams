import React, { createContext } from "react"
import { Subscribe, converge, plan } from "react-streams"
import { of } from "rxjs"
import { mapTo } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const on = plan(mapTo({ message: "On" }))
const off = plan(mapTo({ message: "Off" }))
const source = message$.pipe(converge({ on, off }))

const { Consumer } = createContext({ source, on, off })

export default () => (
  <div>
    <Consumer>
      {({ source }) => (
        <Subscribe source={source}>
          {({ message }) => <h2 id="message">{message}</h2>}
        </Subscribe>
      )}
    </Consumer>

    <div>
      <div>
        <div>
          <Consumer>
            {({ on, off }) => (
              <div>
                <button onClick={on} aria-label="change message to 'on'">
                  On
                </button>
                <button onClick={off} aria-label="change message to 'off'">
                  Off
                </button>
              </div>
            )}
          </Consumer>
        </div>
      </div>
    </div>
  </div>
)
