import React, { createContext } from "react"
import { Stream, mergePlans, plan } from "react-streams"
import { of } from "rxjs"
import { mapTo } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const on = plan(mapTo({ message: "On" }))
const off = plan(mapTo({ message: "Off" }))
const source = message$.pipe(mergePlans({ on, off }))

const { Consumer } = createContext({ source, on, off })

export default () => (
  <div>
    <Consumer>
      {({ source }) => (
        <Stream source={source}>
          {({ message }) => <h2 id="message">{message}</h2>}
        </Stream>
      )}
    </Consumer>

    <div>
      <div>
        <div>
          <Consumer>
            {({ on, off }) => (
              <div>
                <button onClick={on} aria-label="change message to on">
                  On
                </button>
                <button onClick={off} aria-label="change message to off">
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
